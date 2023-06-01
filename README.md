# yzhanTools
A small tools zoome images using Real-CUGAN in bowsers offline.
## Setup
### Install Emsdk
```shell
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
git pull
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```
### Install Vulkan SDK
```shell
sudo apt update
sudo apt upgrade
wget -qO- https://packages.lunarg.com/lunarg-signing-key-pub.asc | sudo tee /etc/apt/trusted.gpg.d/lunarg.asc
sudo wget -qO /etc/apt/sources.list.d/lunarg-vulkan-jammy.list http://packages.lunarg.com/vulkan/lunarg-vulkan-jammy.list
sudo apt update
sudo apt install libc6
sudo apt install vulkan-sdk
# vulkaninfo  check if vulkan has been installed successful 
ls /usr/share/vulkan/
export VULKAN_SDK=/usr/share/vulkan
```
### Download Source Code
```shell
git clone git@github.com:mantoufan/yzhanTool.git
cd yzhanTool/src/img/lib/realcugan-ncnn-vulkan
git submodule update --init --recursive
```
### Build
```shell
# cd yzhanTool/src/img/lib/realcugan-ncnn-vulkan
sudo apt-get install cmake
mkdir build
cd build
sudo cmake ../src
sudo cmake --build . -j 4
```
### Build WASM
```shell
# cd yzhanTool/src/img/lib/realcugan-ncnn-vulkan
mkdir build-wasm
cd build-wasm
CMAKE_TOOLCHAIN_FILE=/home/y/github/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake
emcmake cmake ../src
```