import {createMuiTheme} from "@material-ui/core";

const FONT_BLACK = '#222222'
const FONT_GRAY = '#6D7885'
const MAIN_BLUE = '#3E74DB'
const MAIN_GREEN = '#42C13D'
const MuiTheme = createMuiTheme({
    palette: {
        primary: {
            main: MAIN_BLUE
        },
        secondary: {
            main: MAIN_GREEN
        }
    },
    typography: {
        h1: {
            fontSize: 28,
            fontFamily: "'Galvji', sans-serif",
            color: FONT_BLACK,
        },
        h2: {
            fontSize: 19,
            fontFamily: "'Galvji', sans-serif",
            color: FONT_BLACK,
        },
        body1: {
            fontSize: 16,
            fontFamily: "'Roboto', sans-serif",
            color: FONT_BLACK,
        },
        body2: {
            fontSize: 15,
            fontFamily: "'Galvji', sans-serif",
            color: FONT_GRAY,
        },
        caption: {
            fontSize: 15,
            fontFamily: "'Galvji', sans-serif",
            color: MAIN_BLUE,
        }
    },
    overrides: {
        MuiPaper: {
            rounded: {
                borderRadius: 8
            }
        },
        MuiButton: {
            contained: {
                boxShadow: 'none',
                borderRadius: 4,
                height: 40
            },
            text: {
                fontSize: 15,
                fontFamily: "'Roboto', sans-serif",
            }
        }
    }
});

MuiTheme.shadows[4] = '0 2px 48px rgba(0,0,0,.08)'
MuiTheme.shadows[8] = '0 2px 24px rgba(0,0,0,.16)'
MuiTheme.shadows[2] = 'none'//'0 2px 24px rgba(0,0,0,.16)'
export {
    MuiTheme
}
