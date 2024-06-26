const terms = require('../models/termsConditionsModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

// Create a new term
const createTerms = async (req, res, next) => {
    try {
      const newTerms = new terms({
        heading1: req.body.heading1,
        content1: req.body.content1,
        heading2: req.body.heading2,
        content2: req.body.content2,
        heading3: req.body.heading3,
        content3: req.body.content3,
        heading4: req.body.heading4,
        content4: req.body.content4,
        heading5: req.body.heading5,
        content5: req.body.content5,
      });
  
      await newTerms.save();
      return next(createSuccess(201, 'Terms created successfully'));
    } catch (error) {
      return next(createError(500, 'Internal Server Error'));
    }
  };

  // Get all terms
const getAllTerms = async (req, res, next) => {
    try {
      const allTerms = await terms.find();
      return next(createSuccess(200, "All Terms", allTerms));
    } catch (error) {
      return next(createError(500, 'Internal Server Error'));
    }
  };
  
  // Get a single term by ID
  const getByIdTerms = async (req, res, next) => {
    try {
      const getByIdTerms = await terms.findById(req.params.id);
      if (!getByIdTerms) {
        return next(createError(404, 'Terms not found'));
      }
      return next(createSuccess(200, "Single Terms", getByIdTerms));
    } catch (error) {
      return next(createError(500, 'Internal Server Error'));
    }
  };
  
  // Update terms by ID
  const updateTerms = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedTerms = await terms.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedTerms) {
        return next(createError(404, "Terms Not Found"));
      }
      return next(createSuccess(200, "Terms Details Updated", updatedTerms));
    } catch (error) {
      return next(createError(500, "Internal Server Error"));
    }
  };
  
  // Delete terms by ID
  const deleteTerms = async (req, res, next) => {
    try {
      const deletedTerms = await terms.findByIdAndDelete(req.params.id);
      if (deletedTerms) {
        return next(createSuccess(200, "Terms Deleted"));
      } else {
        return next(createError(404, "Terms Not Found"));
      }
    } catch (error) {
      return next(createError(500, "Internal Server Error: Something went wrong"));
    }
  };
  
  module.exports = { createTerms, getAllTerms, getByIdTerms, updateTerms, deleteTerms };