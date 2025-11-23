{
  description = "Payload CMS Dev Environment";

  inputs = {
    # nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable"; # または "nixos-24.05" など固定も可
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05"; 
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_18
            pkgs.pnpm
          ];

          shellHook = ''
            echo "🚀 Initializing Payload CMS Dev Environment (Flake)..."

            # 1. ホスト側の依存関係インストール (fix:deps)
            pnpm fix:deps
            # 2. Dockerコンテナ経由での型定義生成 (gen:types)
            pnpm gen:types

            echo "------------------------------------------------"
            echo "✨ Environment Ready! Node: $(node -v)"
          '';
        };
      }
    );
}