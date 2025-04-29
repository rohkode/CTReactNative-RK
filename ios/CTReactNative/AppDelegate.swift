import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import CleverTapSDK
import CleverTapReact
import UserNotifications

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {

  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    self.moduleName = "CTReactNative"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    // CleverTap Initialization
    CleverTap.autoIntegrate()  // Auto-integrate the CleverTap SDK (for standard integration)
    CleverTap.setDebugLevel(3) // Set debug level for logs (can be set to 0 for no logs)

    // React Native initialization for CleverTap
    CleverTapReactManager.sharedInstance()?.applicationDidLaunch(options: launchOptions)

    // Set notification center delegate for handling push notifications
    UNUserNotificationCenter.current().delegate = self

    // Register for push notifications
    application.registerForRemoteNotifications()

    // Request permission for notifications (iOS 10 and above)
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
        if granted {
            DispatchQueue.main.async {
                // Register for remote notifications
                application.registerForRemoteNotifications()
            }
        } else {
            print("Notification permission denied: \(error?.localizedDescription ?? "Unknown error")")
        }
    }

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // MARK: - Push Token Registration
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    // Send the device token to CleverTap for push notification management
    CleverTap.sharedInstance()?.setPushToken(deviceToken)
  }

  override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register for remote notifications: \(error.localizedDescription)")
  }

  // MARK: - Notification Tap Handling
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    // Handle the notification when the user taps on it
    CleverTap.sharedInstance()?.handleNotification(withData: response.notification.request.content.userInfo)
    completionHandler()
  }

  // MARK: - Notification Presentation in Foreground
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    // Show notification while the app is in the foreground
    completionHandler([.badge, .sound, .banner])  // Customize the presentation options as needed
  }

  // MARK: - Handling JS Bundle
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}