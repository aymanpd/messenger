import "emoji-mart/css/emoji-mart.css";
import React, { useState, useCallback, useRef } from "react";
import useClickOutside from "./useClickOutside";
import { Picker, EmojiData } from "emoji-mart";
import { FunnyEmojiIcon } from "./smileEmoji";
import { Box, makeStyles, useTheme } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "15px",
    marginRight: "15px",
    position: "relative",
  },
  toggleButton: {
    cursor: "pointer",
  },
  pickerContainer: {
    "& section": {
      [theme.breakpoints.down("sm")]: { width: "250px !important" },
    },
  },
}));

interface EmojiInputProps {
  value: string;
  onSelection(contentWithEmoji: string): any;
}

const EmojiInput = ({ value, onSelection }: EmojiInputProps) => {
  const [showPicker, setPickerState] = useState(false);
  const picker = useRef<HTMLDivElement>(null);

  const dismissPicker = useCallback(() => {
    setPickerState(false);
  }, [setPickerState]);

  useClickOutside([picker], dismissPicker);

  const togglePicker = () => {
    setPickerState(!showPicker);
  };

  const addEmoji = (emoji: EmojiData) => {
    if ("native" in emoji) {
      console.log(emoji);
      onSelection(`${value}${emoji.native}`);
    }
  };

  const styles = useStyles();
  const theme = useTheme();
  return (
    <div className={styles.root} ref={picker}>
      <Box className={styles.pickerContainer}>
        {showPicker && (
          <Picker
            style={{
              position: "absolute",
              right: "100%",
              bottom: "100%",
              [theme.breakpoints.down("sm")]: {
                width: 200,
              },
            }}
            emoji=''
            title=''
            // native={true}
            onSelect={addEmoji}
            enableFrequentEmojiSort={true}
          />
        )}
      </Box>
      <span className={styles.toggleButton} onClick={togglePicker}>
        <FunnyEmojiIcon title='Open emoji selector' />
      </span>
    </div>
  );
};

export default EmojiInput;
