---
title: Patching Bazel External Dependencies
date: 2021-06-01T18:40:05Z
description: A guide to creating and maintaining patches for Bazel external dependencies.
tags:
  - tips
  - Bazel
---

When using Bazel you might find that you need to patch one of your [external dependencies](https://docs.bazel.build/versions/4.2.2/external.html), be it source code for a third-party library or a Starlark rule set. The simple way to approach this is to fork the dependency, push your changes, and point to your fork instead of the source. While this is simple, I would argue it's not easy, as you now have to maintain a fork, which has some downsides:

- Updating the dependency takes many more steps than before (e.g. pulling the latest changes, rebasing or merging those with your patches, pushing those, and finally pointing to your new patches)
- If the patches can't be made public, you might have to use `git_repository` instead of `http_archive`, which has [worse caching performance](https://github.com/bazelbuild/bazel/issues/5116)
- The fork has to live somewhere outside of the workspace that is applying the patches

## Using patches

Instead of forking your dependency, I recommend using the `patches` attribute on the [`http_archive`](https://docs.bazel.build/versions/4.2.2/repo/http.html#http_archive-patches) and [`git_repository`](https://docs.bazel.build/versions/4.2.2/repo/git.html#git_repository-patches) rules. The attribute takes a list of labels for the patches to apply, in the order provided.

If you use `git diff` or `git format-patch` to produce your patches, you'll also need to supply `-p1` to [`patch_args`](https://docs.bazel.build/versions/4.2.2/repo/http.html#http_archive-patch_args).

Using patches addresses the issues I mentioned above:

- Updating a dependency is the same as without using patches, unless the patch needs to be rebased or updated (I'll cover how to handle that a [later section](#updating-patches))
- You don't have to change the repository rule you are currently using
- The patches live in the workspace that uses them

## Creating patches

My preferred way of creating patches involves checking out the dependency locally and using the [`--override_repository`](https://docs.bazel.build/versions/4.2.2/command-line-reference.html#flag--override_repository) flag (e.g. `‑‑override_repository=build_bazel_rules_swift=/Users/bj/dev/rules_swift`). This allows you to iterate on your patch without having to produce patch files or adjust your `WORKSPACE` file.

Once your changes are finalized, I recommend committing them to your checked out dependency's repository. This will make updating the patch in the future easier. You'll be able to rebase your commits with relative ease and generate new patches.

If you committed your changes, then running `git format-patch --keep-subject --no-stat --zero-commit origin/main` will produce a patch file for each commit that differs from `origin/main`. Move these into your workspace somewhere and reference them in the `patches` attribute.

I recommend publishing these commits to a private fork. This allows your teammates to easily update the patches (following the steps in the [next section](#updating-patches)).

### `.bazelrc`

If you find yourself editing your external dependencies a lot (e.g. if you are a maintainer of some Starlark rule sets 😬), you can add the `--override_repository` flags to your `~/.bazelrc`:

```bazelrc
build:ora --override_repository=build_bazel_rules_apple=/Users/bj/dev/rules_apple
build:ors --override_repository=build_bazel_rules_swift=/Users/bj/dev/rules_swift
```

And then whenever you want to use your locally checked out dependency, just pass the corresponding `--config`:

```shell
$ bazel build --config=ors -- //Foo:Bar
```

## Updating patches

If you committed your patches to your locally checked out dependency, then updating them is as easy as rebasing.

After rebasing, check that your changes work with `--override_repository`. Once your commits are in a good state, regenerate your patches, override the ones you already have in your workspace, and update your `WORKSPACE` file to point to the commit that you rebased onto.
