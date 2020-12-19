---
title: WWDC 2015 Predictions
date: 2015-06-05T14:00:00Z
updated: 2015-06-07T14:00:00Z
tags:
    - wwdc
---

I was thinking that my first post about WWDC would be a fun one to fill the time before the event starts. In that spirit I've decided to post my predictions about what will be announced Monday.

<!-- excerpt -->

I've separated them into four sections, and they are roughly in order from most likely to least likely.

## Will be announced 👍

These are the things that I would bet large sums of money on being announced. The only way these ones aren't part of the Keynote is if someone messed up.

### iOS 9

*Of course* iOS 9 will be announced. I believe it's going to be a Snow Leopard like release, meaning a focus on bug fixes, speed ups, and lower memory and space usage. Unlike Snow Leopard which went Intel only, I don't think that iOS 9 will go 64-bit only (though I would love it if it did). The update will still have a couple new features, just like Snow Leopard did, but it will mainly focus on stability, which is long overdue.

### OS 10.11

I don't have many predications about the next version of OS X. I think it's also going to be a Snow Leopard like release. If I had to guess on a name it would be Sequoia.

### Apple Watch Native SDK

A Native SDK for Apple Watch was all but confirmed to be at WWDC in the [Re/code interview with Jeff Williams](http://recode.net/2015/05/27/apple-operations-chief-jeff-williams-takes-the-code-stage-liveblog/). I assume it has all the nice things that we want from it and I'll be disappointed if it's watered down at all to save developers from themselves (for battery life for example).

### Apple Streaming Music (Beats 2.0)

This one has also really [ramped up in the rumor mill recently](http://www.usatoday.com/story/tech/2015/06/03/apples-new-music-service-set-to-launch/28357585/).  I was close to moving this down to the next section, but I think if this isn't announced then someone seriously screwed up.

## Probably will be announced 👍❓

I think that these ones will be announced, but I'm not so set on them that I would bet large sums of money on them. Maybe small sums of money though 😉.

### Apple Pay Improvements

I expect that we will see some improvements to Apple Pay. The main improvement I'm hoping for is loyalty program support (hello Target RedCard!).

### NFC APIs

Last year we were given access to the Touch ID APIs, a year after Touch ID was launched. I believe this was for three reasons: Apple was able to test out and prove Touch ID with first party uses, they prevented an Apple Pay like competitor from happening, and it was the next version of the OS after it was first introduced (and thus hardware was available to test on).

I think the same applies here for NFC: Apple able to test out and prove NFC with Apple Pay, they prevented any Apple Pay like competitor from happening while it gains traction, and it this is the next version of the OS after it was first introduced. We might only get it for iOS, and not Watch OS, but I think it will be for both.

### Swift 2.0

Don't get caught up on the version number. My main prediction is that Swift will be ABI compatible, meaning that they will ship the language runtime with iOS 9 and OS 10.11. This means that people will be able to produce Swift frameworks that won't stop working each time Swift is updated. It also means that our apps won't have to bundle the runtime and gain some precious space back. I also believe having the Swift runtime be part of the OS is needed in order for Apple to ship any Swift based APIs, which I talk about in later predictions.

### Objective-C Improvements

Even though Swift is the new hotness a lot of people are still working in, and will continue to be working in, Objective-C. Apple also has a large Objective-C codebase that they have to maintain. Because of this I expect that we will get some further improvements to Objective-C in order make it easier to interop with Swift. I hope for tuples, optional primitive bridging (for example `Int?` to `NSValue` or something even better), and enums with associated values.

### TVKit

Since the introduction of the puck the Apple TV has been running a variation of iOS. The Apple Watch also runs a variation of iOS. We are getting a Native SDK for the Watch, Apple TV will soon be a much larger platform with the streaming deals they are signing, and the next Apple TV will be pretty beefy… so why leave it out? I can see how it could be another year out, but at a minimum they could give us a WatchKit like SDK (extension based apps) first before eventually giving us native.

### San Fransisco System Font

A plausible [rumor that went around](http://9to5mac.com/2014/11/19/how-to-use-the-apple-watch-font-as-the-system-font-on-os-x-yosemite/) was that iOS 9 and OS 10.11 would have their system font changed to San Fransisco. I think it looks great on the Watch, and it looks like it might work on the iPhone, but I'm not sold yet on the way it looks on the Mac. Maybe they will do slight tweaks to it for the larger screens.

## Probably won't be announced 👎❓

If I was a bigger optimist these would be in the previous section. They aren't so out there that I would say they won't be announced though.

### Swift Cocoa Frameworks

While Swift-based APIs would be possible if they bundle the Swift runtime with the OS, which I believe they will do with my previous prediction, I don't think Swift is stable enough yet. Also, since it's only been a year since the language was announced, they would need to make sure Objective-C interoperability was improved (another thing I predict will happen), limit themselves to not-very-Swift like structures, or have the framework itself be incompatible with Objective-C and be more forward looking. All in all, my gut says it's too soon.

### Siri Integration

This is one that people have wanted for a while and I'm not sure if it's going to happen yet. With the introduction of extensions last year we have lots of ways to improve the system with little bits of runnable code. One of those ways could be Siri-based extensions.

### Force Touch API on iOS

This one I was on the fence about. We have Force Touch APIs for OS X, and we will have them for Apple Watch with the Native SDK.  We will (probably) have iPhones and iPads with Force Touch later this year. So why don't I think they will give us access to this now? Apple doesn't give us access to new SDKs or APIs until the required hardware has been announced. This would basically announce a feature for the next iOS devices before the devices themselves are announced.

## Won't be announced 👎

It's hard for me to say "this definitely won't be announced", but I hate being wishy-washy. Therefore I'll predict that the following things won't be a announced.

### Any hardware at all

Last year we didn't get any hardware announcements. Lately Apple has been using dedicated events to announce hardware, I believe mainly to allow them to be in people's thoughts all year around. If we look at the events from WWDC last year until now we have the following:

- Last WWDC: No hardware
- September Event: New iPhones
- October Event: New iPads and Apple Watch announced
- March Event: New MacBook and Apple Watch
- WWDC

I believe TVKit is going to be announced, but I doubt that it will require the new 4K Apple TV to run on. If it does, or simply because I'm wrong about hardware, this is the most likely piece of hardware to be announced. Following that, and not really close behind in any regard, would be the iPad Pro, which I'm not 100% sure is ever going to see the light of day, especially given the new MacBook which is almost an iPad Pro itself. If the iPad Pro is going to be announced I expect it to be at the October event along with the non-Pro iPad.

All other hardware isn't important enough to think about right now. By spreading out announcements around the year Apple is able to stay in the media more often. Also, and sometimes people forget this, WWDC is primarily a *developer* conference, meaning most of the announcements should be tied to what we need to work on for the next year. New Mac Pros don't fit that criteria.

### UXKit

Last year I thought that Apple's big surprise was going to be a unification of the UI frameworks for iOS (UIKit) and OS X (AppKit), which some people are calling UXKit. This was mainly because Yosemite was going to bring the UI of OS X in line with iOS. What a better time to bring the UI frameworks together?

Now though, giving Swift has entered the picture, I think that it's still too soon for it to come out. Something like UXKit will be used for the next 8+ years and I doubt that they would do it in Objective-C. If the Swift runtime is packaged with the operating systems though this could be a Swift based API and come out this year. I would expect them to start with something smaller for their first set of Swift APIs though. If this does happen it would definitely be the "Swift" (a.k.a. "Oh Shit!") moment of WWDC 2015.

----

I think this year's WWDC will be a good one. If I'm 100% correct with my predictions it might not be *as* good as last year (it's hard to top Swift), but it certainly has potential of being as good or better if they surprise us again.

I'll probably be tweeting during the Keynote if you want to hear my thoughts in realtime. Otherwise I'll be back sometime Monday to report back how well I did on my predictions.

----

**Update June 7th:** After talking about my predictions with some more people I realize there is an opportunity for Apple to have the Native Watch SDK and/or TVKit be in Swift. Since they are different "platforms" there is less need to make sure they can interop with Objective-C. Also, since they would require a deployment target of iOS 9 (or the equivalent in a different OS) they could utilize Swift being built into the operating system.
