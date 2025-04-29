package com.ctreactnative

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.clevertap.react.CleverTapRnAPI

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "CTReactNative"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // Initialize deep link handling for CleverTap
    CleverTapRnAPI.setInitialUri(intent.data)
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return DefaultReactActivityDelegate(
      this,          // activity
      mainComponentName  // main component name
      // no fabricEnabled flag here
    )
  }
}