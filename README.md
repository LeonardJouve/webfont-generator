# webfont-generator-cli

Convenient CLI to generate webfonts and css helper classes from SVGs.

Uses [fontello](https://github.com/fontello/fontello#developers-api) API.

## Preview

![image](https://github.com/LeonardJouve/webfont-generator-cli/assets/81326532/c2ec25c1-ba33-4f9d-8703-b1e04292eaff)

## Installation

### Install with [NPM](https://www.npmjs.com/)

`npm i webfont-generator-cli --save-dev`

### Remove

`npm remove webfont-generator-cli`

## Usage

### Generate the webfont and css files

- FROM: SVGs located in the `icons` folder | Path can be changed with `--icons` option
- TO: `webfont` | Path can be changed with `--out` option

`npx webfont-generator`

#### Help

Get a list of the available options

`npx webfont-generator-cli --help`

#### Icons

Set the path to the SVGs folder (DEFAULT `icons`)

`npx webfont-generator-cli --icons path_to_your_svgs`

#### Out

Set the path of the output directory containing the font and CSS files (DEFAULT `webfont`)

`npx webfont-generator-cli --out path_to_the_output_folder`

### Use the webfont

There are two different ways to use it

#### Import the webfont directly in your CSS

The font can be found to the following format on the output directory (DEFAULT `webfont`) inside the `font` subdirectory.

- .eot
- .svg
- .ttf
- .woff
- .woff2

#### Import premade CSS file including a helper class for every icon

Premade CSS file can be found on the output directory (DEFAULT `webfont`) inside the `css` subdirectory.

`webfont.css` includes the required helpers class for all of your icons.

After importing the stylesheet, you can use the `icon-{svg-file-name}` class pattern to automatically render your icon inside a `::before` pseudo-element

### Styling

You can use the `[class^="icon-"]:before, [class*=" icon-"]:before` CSS selector to override any predefined styles as needed.

## Example

`npm i webfont-generator-cli --save-dev`

```
my-icons
    - close.svg
    - profile.svg
index.html
```

Every SVG must have a [viewBox](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox) attribute.

`npx webfont-generator --icons my-icons --out my-webfont`

index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="./my-webfont/css/webfont.css">
  </head>
  <body>
        <i class="icon-profile"></i>
        <i class="icon-close"></i>
    </body>
</html>
```

![image](https://github.com/LeonardJouve/webfont-generator-cli/assets/81326532/c2ec25c1-ba33-4f9d-8703-b1e04292eaff)
