import React, { useState } from 'react';
import { useFormFields, useField } from 'payload/components/forms';

const AiAnalysisButton: React.FC = () => {
  console.log('AiAnalysisButton mounted');
  const { filename, mimeType } = useFormFields(([fields]) => ({
    filename: fields.filename?.value as string,
    mimeType: fields.mimeType?.value as string,
  }));

  const { setValue: setOcrValue } = useField({ path: 'aiAnalysis.ocr.text' });
  const { setValue: setOcrModelValue } = useField({ path: 'aiAnalysis.ocr.model' });
  const { setValue: setOcrDateValue } = useField({ path: 'aiAnalysis.ocr.analyzedAt' });

  const { setValue: setDescTextValue } = useField({ path: 'aiAnalysis.description.text' });
  const { setValue: setDescTagsValue } = useField({ path: 'aiAnalysis.description.tags' }); // This might need adjustment if tags is a complex array
  const { setValue: setDescModelValue } = useField({ path: 'aiAnalysis.description.model' });
  const { setValue: setDescDateValue } = useField({ path: 'aiAnalysis.description.analyzedAt' });

  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!filename) {
      alert('File not found or not saved yet. Please save the file first.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          mimeType,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { ocr, description, tags } = data.analysis;
        const now = new Date().toISOString();
        const modelName = 'gemini-2.0-flash-001';

        console.log('[AiAnalysisButton] Analysis result:', data.analysis);

        // Update OCR fields
        setOcrValue(ocr);
        setOcrModelValue(modelName);
        setOcrDateValue(now);

        // Update Description fields
        setDescTextValue(description);

        // Handle Tags (robust check)
        let formattedTags: { item: string }[] = [];
        if (Array.isArray(tags)) {
          formattedTags = tags.map((tag: string) => ({ item: tag }));
        } else if (typeof tags === 'string') {
          // Fallback if AI returns a comma-separated string
          formattedTags = tags.split(',').map((tag) => ({ item: tag.trim() }));
        }

        if (formattedTags.length > 0) {
          console.log('[AiAnalysisButton] Setting tags:', formattedTags);
          // Payload often expects rows to have IDs, though it should generate them.
          // However, let's try just the value.
          setDescTagsValue(formattedTags);

          // If the above doesn't work, we might need to verify the field path or use specific array helpers if this was a custom field component for the array itself.
          // Since this is a UI field *outside* the array, accessing the array via useField should work.
          // Temporary alert for debugging
          // alert(`Found ${formattedTags.length} tags. Setting them now.`);
        } else {
          console.warn('[AiAnalysisButton] No tags found to set.');
        }

        setDescModelValue(modelName);
        setDescDateValue(now);

        alert('Analysis complete!');
      } else {
        alert(`Analysis failed: ${data.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={isLoading}
        style={{
          padding: '10px 15px',
          backgroundColor: isLoading ? '#ccc' : '#000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        {isLoading ? 'Analyzing...' : '✨ Analyze with AI'}
      </button>
    </div>
  );
};

export default AiAnalysisButton;
