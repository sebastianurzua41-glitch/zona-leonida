#!/bin/bash
# Prepara una sesión nueva: dependencias y modelo de voz (Kokoro, Apache-2.0).
set -e
cd "$(dirname "$0")"
pip install -q kokoro-onnx soundfile scipy
npm install --silent
mkdir -p models build
[ -f models/voices-v1.0.bin ] || curl -sSL -o models/voices-v1.0.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
[ -f models/kokoro-v1.0.onnx ] || curl -sSL -o models/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
echo "listo"
