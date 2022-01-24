---
title: Bazel shutdown
date: 2020-12-29T22:42:00Z
tags:
  - tips
  - Bazel
---

Ever change proxy settings or install new root certificates, and `bazel` just won't pick up the changes?
<!-- excerpt -->
Run `bazel shutdown` and then your `bazel` command again, it should work this time.

## Details

The Bazel client uses a [long-lived server process](https://docs.bazel.build/versions/5.0.0/guide.html#clientserver-implementation) to cache information needed to make certain commands, such as `bazel query`, fast. The server is launched the first time `bazel` is run for a given output base (which by default is determined by [the path of the base workspace directory and your userid](https://docs.bazel.build/versions/5.0.0/output_directories.html#current-layout)) and it shuts down after a period of inactivity (which defaults to [3 hours](https://docs.bazel.build/versions/5.0.0/command-line-reference.html#flag--max_idle_secs)).

The server is the process that actually makes network requests, not the `bazel` frontend process. Since it captures certain configuration state at launch that doesn't refresh until it's relaunched (such as HTTP proxy settings or the [JVM Truststore](https://connect2id.com/blog/importing-ca-root-cert-into-jvm-trust-store)), you'll need to run [`bazel shutdown`](https://docs.bazel.build/versions/5.0.0/command-line-reference.html#shutdown) to force it to shutdown and re-capture that configuration state.
