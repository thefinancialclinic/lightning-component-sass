# lightning-component-sass
Use SASS to Style Lightning Components.

## Steps to getting the gulp file working correctly.

- Make sure that you copy the gulpfile and package.json file into your repo.

- Find all the empty css files that include:
```
.THIS {

}
```
- Replace them with:
```
.THIS {
    /*! blank */
}
```


- To prepare the gulp file you:
  - npm install
  - gulp create-sass (only run the first time you set this up)
    - I suggest committing this file
  - gulp copy-sass
    - I suggest committing this file
  - To watch for any changes to the scss folder run
    - gulp watcher



## Things to keep in mind.

- Never run create-sass after you did it the first time. It will not work. Also it will ruin your styles. This is only useful to get started.

- Every time you create a new component and you dont add styles to that component make sure you replace the css file with the blank comment. like the example above.

- Moving forward if you create new component and your going to style it. Make sure you add the component scss file to your scss files.
