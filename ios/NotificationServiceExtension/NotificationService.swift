//  NotificationService.swift
//  NotificationServiceExtension
//  Created by Rohit Khandka on 03/09/26.

import UserNotifications
import CTNotificationService
import CleverTapSDK

class NotificationService: CTNotificationServiceExtension {

    var contentHandler: ((UNNotificationContent) -> Void)?
     var bestAttemptContent: UNMutableNotificationContent?
     override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
         print("NSE called — Notification payload: \(request.content.userInfo)")
       
                 let userDefaults = UserDefaults(suiteName: "group.ct12.rnsample")
                 let userId = userDefaults?.object(forKey: "identity")
                 let userEmail = userDefaults?.object(forKey: "email")
             
                print(userId, userEmail)
       
                         if let id = userId,
                            let email = userEmail {

                             let profile: [String: Any] = [
                                 "Identity": id,
                                 "Email": email
                             ]
                     CleverTap.sharedInstance()?.onUserLogin(profile)
                 }
         CleverTap.sharedInstance()?.recordNotificationViewedEvent(withData: request.content.userInfo)
      super.didReceive(request, withContentHandler: contentHandler)
     }
}
