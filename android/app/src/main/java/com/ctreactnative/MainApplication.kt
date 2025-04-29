package com.ctreactnative

import android.util.Log
import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.soloader.SoLoader
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.ActivityLifecycleCallback

class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost = object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport() = BuildConfig.DEBUG
        override fun getPackages(): List<ReactPackage> = PackageList(this).packages
        override fun getJSMainModuleName() = "index"
    }

    override val reactNativeHost: ReactNativeHost
        get() = mReactNativeHost

    override fun onCreate() {
        super.onCreate()
        // Initialize CleverTap
        CleverTapAPI.setDebugLevel(CleverTapAPI.LogLevel.DEBUG)
        ActivityLifecycleCallback.register(this)
        CleverTapAPI.getDefaultInstance(applicationContext)

        // Initialize SoLoader
        SoLoader.init(this, /* native exopackage */ false)
    }
}