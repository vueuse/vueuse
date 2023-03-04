# Why Doesn't VueUse Have Translations?

VueUse's documentation doesn't have translations, and **we don't plan to officially maintain any translations in the near future**.

Here are a few considerations why we made this decision:

## Duplication and Divergence

One of the well-known problems of doing documentation translations is it's hard to keep them up to date. Doing a new translation means we are duplicating the existing documentation, and it requires a lot of effort to sync the changes.

In VueUse we group the code, documentation, demo, and tests inside the same folder for each function (group-by-function over group-by-type). This makes the context of each function closer and easier to read. However, this also means if we want to have translations directly in the same repository, the maintenance cost will grow exponentially.

## Maintenance Responsibility

There are a lot of functions in VueUse. Maintaining the code and reviewing PRs are already a lot of work we barely have enough effort to do. It might seem easy for contributors to send PRs to add translations at the beginning. But it's quite common for contributors to do one-time contributions only (that's totally fine in open source!). The original translator might not always be around when the English documentation gets updated, and then the responsibility of keeping the translations synchronized often falls on the maintainers' shoulders. While we have a great team and community who speaks different languages, it doesn't mean maintaining others' translations is effortless.

## Maintenance Focus

VueUse is a non-profit open-source project. With limited resources, we want to focus more on the logic and code of VueUse. We are trying our best to make the functions as intuitive and self-explainable as possible. We also want to focus more on improving the existing English documentation and demo.

We are counting on improved machine translation as time passes, where users can use the translation tools to read the documentation in their language easily if needed.

## Community Translations

That said, we are still open to community translations. We are happy to link to the community translations if they are well-maintained and up-to-date. If you are maintaining a translation, you can open a discussion to let us know. Thank you!
