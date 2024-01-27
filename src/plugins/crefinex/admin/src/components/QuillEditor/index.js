import React from "react";
import ReactQuill from "react-quill";
import { Typography } from "@strapi/design-system";
import "react-quill/dist/quill.snow.css";
const Editor = ({ onChange, name, value }) => {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
    ],
  };
  return (
    <Typography>
      <ReactQuill
        theme="snow"
        value={value}
        modules={modules}
        onChange={(content, event, editor) => {
          onChange({ target: { name, value: content } });
        }}
      />
    </Typography>
  );
};
export default Editor;
