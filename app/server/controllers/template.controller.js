import mongoose from "mongoose";
import slugify from "slugify";
import Template from "../models/template.model.js";
import { decrypt, encryptIds } from "../utils/function.encryption.js";
import {
  processPaginationParams,
  processPaginationQuery,
} from "../utils/function.pagination.js";
import { checkRequiredFields } from "../utils/function.required.js";

export const getTemplates = async (req, res, next) => {
  try {
    const { limit, page, skip } = processPaginationQuery(req.query);

    const templates = await Template.find()
      .select("-createdAt -updatedAt -__v")
      .limit(limit)
      .skip(skip);
    if (!templates || templates.length === 0) {
      const error = new Error("No templates found.");
      error.status = 404;
      throw error;
    }

    const totalTemplates = await Template.countDocuments();
    const encryptedTemplates = encryptIds(templates);

    const paginationParams = processPaginationParams(
      page,
      limit,
      totalTemplates,
    );
    res.status(200).json({
      success: true,
      data: encryptedTemplates,
      pagination: paginationParams,
    });
  } catch (err) {
    next(err);
  }
};

export const createTemplate = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (Object.keys(req.body).length === 0) {
      const error = new Error("Request body cannot be empty.");
      error.status = 400;
      throw error;
    }

    const requiredFields = [
      {
        name: "Name",
        field: "name",
      },
    ];
    checkRequiredFields(requiredFields, req.body);

    let { name, slug } = req.body;

    const existingTemplate = await Template.findOne({
      slug: slugify(name, {
        replacement: "-",
        lower: true,
        strict: true,
        trim: true,
      }),
    });
    if (existingTemplate) {
      const error = new Error("Template already exists.");
      error.status = 409;
      throw error;
    }

    await Template.create(
      [
        {
          name,
          slug,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      success: true,
      message: "Template created successfully.",
    });
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    next(err);
  }
};

export const updateTemplate = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let templateId = req.params.id ?? null;
    if (!templateId) {
      const error = new Error("Missing required parameter: `id`");
      error.status = 400;
      throw error;
    }
    templateId = decrypt(templateId);

    if (Object.keys(req.body).length === 0) {
      const error = new Error("Request body cannot be empty.");
      error.status = 400;
      throw error;
    }

    const existingTemplate = await Template.findOne({ _id: templateId });
    if (!existingTemplate) {
      const error = new Error("No template found with the provided Id.");
      error.status = 404;
      throw error;
    }

    const isSameTemplate = Object.keys(req.body).every(
      (key) => req.body[key] === existingTemplate[key],
    );
    if (isSameTemplate) {
      return res.status(200).json({
        success: true,
        message: "No changes detected.",
      });
    }

    if (req.body.name && !req.body.slug) {
      req.body.slug = slugify(req.body.name, {
        replacement: "-",
        lower: true,
        strict: true,
        trim: true,
      });
    }

    await Template.findByIdAndUpdate(templateId, req.body, { session });

    await session.commitTransaction();
    await session.endSession();

    res.status(200).json({
      success: true,
      message: "Template updated successfully.",
    });
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    next(err);
  }
};

export const deleteTemplate = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let templateId = req.params.id ?? null;
    if (!templateId) {
      const error = new Error("Missing required parameter: `id`.");
      error.status = 400;
      throw error;
    }
    templateId = decrypt(templateId);

    const existingTemplate = await Template.findOne({ _id: templateId });
    if (!existingTemplate) {
      const error = new Error("No template found with the provided Id.");
      error.status = 404;
      throw error;
    }

    await Template.findByIdAndDelete(templateId, { session });

    await session.commitTransaction();
    await session.endSession();

    res.status(200).json({
      status: true,
      message: "Template successfully deleted.",
    });
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    next(err);
  }
};
