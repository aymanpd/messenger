import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

let theme = createMuiTheme();

theme = responsiveFontSizes(theme);

console.log(theme);

export default theme;
