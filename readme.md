## What is this project ?
- An web scraper that get all content of https://eslbrains.com/ classes and download it's pdfs on folders with an explanatory structure that has information about class level and category.

## Purpose of this scraper:
- I've created it for english teachers that pay for `esl brains`. With this project it's possible to just pay one month and then install all contents.
- With this you don't need to pay each month of the year, saving money :).
- It's important to say that this project works with free version too!!

## Organized structure example:
![image](https://user-images.githubusercontent.com/66435387/216848322-127f9121-3d5a-453b-abd4-51232b19937a.png)

## Using correct node version
- `nvm i 18`
- `nvm use`

## Run dev:
- `npm run dev`

## Run prod:
- `npm run prod`

## Get all free content:
- You just need to run the project normally and then you will get

## Get authenticated content:
- You must have a payed account.
- You must create a file called `secrets.json` on project's root.

Example `secrets.json`:
```json
{
  "token": "your token here",
  "currentPlan": "premium-plan"
}
```

- To get your token you need to inspect a logged request into esl brains and get the cookie value.
