import mongoose from "mongoose";
import slugify from "slugify";

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    slug: {
      type: String,
      default: function () {
        return slugify(this.name, {
          replacement: "-",
          lower: true,
          strict: true,
          trim: true,
        });
      },
      unique: [true, "Slug already exists."],
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must only contain lowercase letters, numbers, and hyphens. No spaces or special characters allowed.",
      ],
    },
  },
  { timestamps: true },
);

templateSchema.pre("save", async function (next) {
  if (this.isModified("name") && !this.isModified("slug")) {
    this.slug = slugify(this.name, {
      replacement: "-",
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

const Template = mongoose.model("Template", templateSchema);

export default Template;
