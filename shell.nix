{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.pnpm
  ];

  shellHook = ''
    echo "🚀 Initializing Payload CMS Dev Environment..."

    # 1. ホスト側の依存関係インストール (fix:deps)
    pnpm fix:deps
    # 2. Dockerコンテナ経由での型定義生成 (gen:types)
    pnpm gen:types

    echo "------------------------------------------------"
    echo "✨ Environment Ready! Node: $(node -v)"
  '';
}