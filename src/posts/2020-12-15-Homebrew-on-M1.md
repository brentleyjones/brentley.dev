---
title: Using Homebrew on Apple Silicon (M1) Macs
description: A quick guide to getting Homebrew up and running on your new M1 Mac.
date: 2020-12-16T02:14:34Z
tags:
  - tips
  - Apple Silicon
---

Currently running Homebrew natively on Apple Silicon is an "unsupported" configuration, so you'll have to jump through a few hoops:

- Install Homebrew to `/opt/homebrew` manually:
    ```shellsession
    $ sudo mkdir /opt/homebrew
    $ sudo chown -R $(whoami):admin /opt/homebrew
    $ cd /opt
    $ curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
    ```
- Add `/opt/homebrew/bin` to your path, before `/usr/local/bin`
- (Optional, though recommended) Install Intel-flavored Homebrew to `/usr/local/bin`:
    ```shellsession
    $ arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    $ alias ibrew='arch -x86_64 /usr/local/bin/brew'
    ```

Now, when you run `brew` it will invoke the `arm64` version and build/install `arm64` binaries and libraries to `/opt/homebrew`, and when you run `ibrew` it will invoke the the `x86_64` version and build/install `x86_64` binaries and libraries to `/usr/local`.

## Details

Sam Soffes has an [in-depth post](https://soffes.blog/homebrew-on-apple-silicon) covering the finer details of what is summarized above, so instead of reiterating what he's already written I recommend you read his post.
