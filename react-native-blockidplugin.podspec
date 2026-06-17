require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |s|
  s.name         = "react-native-blockidplugin"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => '16.0' }
  s.source       = { :git => "https://github.com/1KBlockID/reactnative-blockid-demo-app.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  # Required for ObjC to import Swift-generated header in dynamic framework mode
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  # BlockID SDK is SPM-only (no podspec) since version 1.30.61.
  # Use React Native's spm_dependency helper (available since RN 0.75) to resolve via SPM.
  # Requires USE_FRAMEWORKS=dynamic in the consuming app's Podfile.
  if defined?(spm_dependency)
    spm_dependency(s,
      url: 'https://github.com/1KBlockID/ios-blockidsdk.git',
      requirement: {kind: 'exactVersion', version: '1.30.61'},
      products: ['BlockID']
    )
    spm_dependency(s,
      url: 'https://github.com/Alamofire/Alamofire.git',
      requirement: {kind: 'exactVersion', version: '5.11.2'},
      products: ['Alamofire']
    )
    spm_dependency(s,
      url: 'https://github.com/attaswift/BigInt.git',
      requirement: {kind: 'exactVersion', version: '5.7.0'},
      products: ['BigInt']
    )
    spm_dependency(s,
      url: 'https://github.com/krzyzanowskim/CryptoSwift.git',
      requirement: {kind: 'exactVersion', version: '1.10.0'},
      products: ['CryptoSwift']
    )
    spm_dependency(s,
      url: 'https://github.com/krzyzanowskim/OpenSSL.git',
      requirement: {kind: 'exactVersion', version: '3.3.3001'},
      products: ['OpenSSL']
    )
    spm_dependency(s,
      url: 'https://github.com/trustwallet/wallet-core.git',
      requirement: {kind: 'exactVersion', version: '4.6.13'},
      products: ['WalletCore']
    )
  else
    Pod::UI.warn "[react-native-blockidplugin] spm_dependency is not available. " \
      "BlockID SDK 1.30.61+ requires React Native >= 0.75 for SPM support. " \
      "Please upgrade React Native or the build will fail with missing BlockID symbols."
  end

  # Use install_modules_dependencies helper to install the dependencies if React Native version >=0.71.0.
  # See https://github.com/facebook/react-native/blob/febf6b7f33fdb4904669f99d795eba4c0f95d7bf/scripts/cocoapods/new_architecture.rb#L79.
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"

    # Don't install the dependencies when we run `pod install` in the old architecture.
    if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
      s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
      s.pod_target_xcconfig    = (s.pod_target_xcconfig || {}).merge({
          "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
          "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
          "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
      })
      s.dependency "React-Codegen"
      s.dependency "RCT-Folly"
      s.dependency "RCTRequired"
      s.dependency "RCTTypeSafety"
      s.dependency "ReactCommon/turbomodule/core"
    end
  end
end
