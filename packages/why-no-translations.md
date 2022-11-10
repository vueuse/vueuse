# Why VueUse Don't Have Translations?

VueUse's documentation doesn't have translations, and we don't have plan to have maintain any translations officially in the near future.

Here are a few considerations why we made this decision:

## Duplication and Divergence

One of well known problems of doing documentation translations is it's hard to keep them up to date. Making a new translation meaning we are duplicating the existing documentation, and it requires a lot of effort to sync the changes manually.

In VueUse we group the code, documentation, demo, tests inside a same folder for each function (group-by-function over group-by-type). This makes the context of each function closer, and it's easier to maintain. However, this also means if we want to have translations directly in the same repository, the maintenance cost will grow exponentially.

## Maintenance Responsibility

There are a lot of functions in VueUse. Maintaining the code and reviewing PRs are already a lot of work we barely have effort to do. We see we still have quite a lot improvements to make in the existing documentation and demo.

It might seems easy for contributors to send PRs to add translations at the beginning. But we see it's quite common for contributors to do one-time contributions only (that's totally fine in open source!). Then the responsibility of keeping the translations synchronized often fall on the maintainers shoulders. While we have a great team and community who speaks different languages, it doesn't mean the maintainces is effortless.

## Maintenance Focus

VueUse is a non-profit open source project, with the limited resources, we want to focus more on the logic and code of VueUse. We are trying out best to make the functions as intuitive and self-explainable as possible. We also want to focus more on improving the existing English documentation and demo.

We are also counting on better and improved machine translation, where users can use the translation tools to read the documentation in their own language if needed.

## Community Translations

That said, we are still open to community translations. We are happy to link to the community translations if they are well maintained and up to date. If you are maintaining a translation, you can open an discussion to let us know, thank you!
