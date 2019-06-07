# QuoteApp_RN

# Use
git clone https://github.com/dovantuit/QuoteApp_RN.git

cd QuoteApp_RN
npm install

export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

react-native run-android
