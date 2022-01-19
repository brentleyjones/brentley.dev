---
title: WWDC 2015 Impressions
header-img: img/wwdc-2015-bg.png
date: 2015-06-17T14:25:00Z
tags:
  - WWDC
---

I had a goal of writing about the sessions that I attended each day while at WWDC. It was a good goal, but totally unachievable for me this year. Instead I'm going to give my thoughts on a couple of the high level focus areas.

<!-- excerpt -->

## Swift 2.0

There were a lot of announcements for Swift this year. Let's dig into some of them.

### Open source

Swift becoming open source is huge. I'm so glad that they are doing it this early in the process. The Swift team has been great at listening to community feedback and changing the language based on it, but this will take that to a whole new level. I get all tingly inside knowing that I will be able to personally contribute to the language, even if it's only in a small way.

I spoke to Chris Lattner before a session last week and asked about ABI stability. He mentioned that with Swift going open source there will most likely be some breaking changes introduced. Hopefully not as many as Swift 1.0 -\> 2.0, but still enough that they don't feel good about locking it down yet. I only mention this (since it seems obvious in hindsight) because it shows how much they are willing to let the language change, in a good way, before having it settle down.

### Error handling

Don't we all love error handling? Well with Swift 2.0 it's both harder to ignore errors and easier to properly deal with them.

Swift's new error handling mechanisms are a codified evolution of `NSError` that we are use to from Cocoa. In place of `NSErrorPointer` as an argument we now use the `throws` keyword in function signatures. So, instead of having the following signature:

```swift
func methodThatErrors(error: NSErrorPointer) -> BOOL
```

we have one like so:

```swift
func methodThatErrors() throws
```

This implies that the method can `throw` an error of `ErrorType` and your code has to be prepared to deal with it. That's where `try` and `do {} catch` comes in. `try` is required as part of a function call to signify that it may error out, and `do {} catch` is the mechanism used to deal with the error in the same scope:

```swift
do {
   someMethodThatDoesntError()
   let value = try someOtherMethodThatErrors()
   print(value)
} catch {
   print(error)
}
```

You can use `try` without `catch`, or re-`throw` an error in a catch, but then your function needs to be marked with `rethrows`.

There is a lot more to the error handling, but that's too much to go into right now. I highly recommend looking into it since it's the biggest change in Swift 2.0.

**Note:** Even though Swift uses the `try`/`catch`/`throw` terminology, this is not exception handling. Swift's error handling model is very performant and lives alongside existing exceptions (which should simply be used to crash).

### Other improvements

There were numerous other improvements to Swift including the addition of switch style pattern matching nearly everywhere, a codified way of doing early exits with the `guard` keyword, a flavor of the `finally` keyword from other languages in the form of `defer`, mainly to be used with the new error handling system but also useful with `guard`, the ability to unit test code without making them `public` with the `@testable import` syntax, and more improvements that aren't coming to mind right now.

## UIStackView

https://twitter.com/pilky/status/609062495123349504

`UIStackView` is a very big thing. People may not realize it now, but this will be the standard way of making most of your UI going forward. The best part of WatchKit development was working with `WKInterfaceGroup` which is a weaker sibling to `UIStackView`. Learn `UIStackView`, love `UIStackView`.

## UI testing

I love testing. I've disliked that UI testing wasn't a first class citizen in the iOS world. This resulted in a lot of external tools like [Calabash](http://calaba.sh) being created to fill the gap. Finally UI testing is integrated into XCTest and it's great.

UI testing utilizes accessibility information exposed by your application. This has the added benefit of forcing you to make your application accessible while also allowing you to test and maintain this accessibility. Since I also love accessibility this is another win for me. I hope it's easy to test different locales as well, since internationalization is one of my other non-code based loves.

## Fullscreen Splitview

We all saw splitview multitasking coming last year when they gave us size classes. Yes, they were marginally useful in the case of the iPhone 6 Plus, but their main use will be with the iPad's new multitasking. The lesson to learn here is to adopt things as soon as Apple gives them to us, so that we are always on the curve instead of behind it. Even if you implemented size classes last year I would still watch [this year's Session 212](https://developer.apple.com/videos/wwdc/2015/?id=212) to make sure your app is truly ready for the reality of splitview multitasking (hint: it probably isn't).

## App Thinning

App Thinning was a nice addition that I didn't see coming, though looking back it sort of seemed inevitable if they weren't going to chase the vector based graphics dream. With App Thinning there are three ways in which your app can have a lower initial and overall space footprint: Bitcode, Slicing, and On Demand Resources.

With Bitcode enabled (optional for iOS 9 and required for watchOS 2) instead of submitting a fully compiled bundle in your xcarchive to Apple, instead the Bitcode, formally known only as LLVM IR, is submitted. Apple then uses that Bitcode to generate IPAs for all the architectures that your application runs on. Besides for making your downloaded app not have code slices for code that will never be run on the user's device, it also allows for LLVM optimizations for existing architectures to be applied automatically and potentially even allows your application to [support hardware not yet released](https://medium.com/@InertialLemon/apple-s-bitcode-telegraphs-future-cpu-plans-a7b90d326228).

Utilizing xcasset catalogs, including their new support for arbitrary data files, allows the App Store to generate even more permutations of your IPA that only include resources that your user will need to use. They call this "Slicing". This is a clever solution to the bloat caused by @3x images for example.

Finally with On Demand Resources you can tag your resources into arbitrary groups. Then you can have certain groups pre-downloaded as part of the installation and the rest only downloaded on demand. These groups can be reclaimed from the cache by the system allowing many more applications to share the same space. This is really useful for all of those 8gb devices out there. I'm just glad that first run experiences will no longer permanently take up space when I can never view them again.

From a user's perspective though with On Demand Resources, I do wonder about the game levels example which was presented repeatedly. Will there be a standard way to tell the system or app that I want to download all the assets I could possibly need? What if I'm about to board a plane? I want to be able to play all the levels of my game even when I'm offline.

## WatchKit

I don't want to be too bitter on this blog (that's what my workplace is for 😉), but I feel a bit let down by what we were given in WatchKit for watchOS 2. It's true that a lot of the use cases that were requested by developers were corrected, and that most people will be able to make the apps that they want… but these are still not native watch apps. For that, we would be writing apps with something like [PepperUICore](https://deallocatedobjects.com/posts/confirmed-apple-watch-runs-ios).

https://twitter.com/stroughtonsmith/status/609262287212425216

I'm not sure why Apple hasn't given us full access yet. My guy tells me it's because they are still trying to hold our hands and force us to make certain kinds of apps, shaping the way the device is to be used in its early years where it can still fail as a category. I guess time will tell (pun not intended).

## TVKit

Another disappointment, but for a different reason, was the lack of TVKit at WWDC.

https://twitter.com/jgarnham/status/608989960885170176

https://twitter.com/stroughtonsmith/status/610390200007720960

https://twitter.com/stroughtonsmith/status/610390333185236994

I again have no real insight on why it was delayed, but I believe it had to do with the TV streaming contracts, which held up the new hardware, which might be required for native code. I know this is coming, and coming soon, so we will see shortly what it's all about.
