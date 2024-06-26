const policy = require('../models/policyModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

// Create a new policy
const createPolicy = async (req, res, next) => {
    try {
        const newPolicy = new policy({
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

        await newPolicy.save();
        return next(createSuccess(201, 'Policy created successfully'));
    } catch (error) {
        return next(createError(500, 'Internal Server Error'));
    }
};

// Get all policies
const getAllPolicy = async (req, res, next) => {
    try {
        const allPolicies = await policy.find();
        return next(createSuccess(200, "All Policies", allPolicies));

    } catch (error) {
        return next(createError(500, 'Internal Server Error'));
    }
};

// Get a single policy by ID
const getByIdPolicy = async (req, res, next) => {
    try {
        const getByIdPolicy = await policy.findById(req.params.id);
        if (!policy) {
            return next(createError(404, 'Policy not found'));
        }
        return next(createSuccess(200, "Single Policy", getByIdPolicy));

    } catch (error) {
        return next(createError(500, 'Internal Server Error'));
    }
};

// update Policy by id
const updatePolicy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedPolicy = await policy.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPolicy) {
          return next(createError(404, "Policy Not Found"));
        }
        return next(createSuccess(200, "Policy Details Updated", updatedPolicy));
      } catch (error) {
        return next(createError(500, "Internal Server Error"));
      }
};

// delete policy by id 
const deletePolicy = async (req, res, next) => {
    try {
        const deletepolicy = await policy.findByIdAndDelete(req.params.id);
        if (deletepolicy) {
            return next(createSuccess(200, "Policy Deleted!"));
        } else {
            return next(createError(404, "Policy Not Found."));
        }
    } catch (error) {
        return next(createError(500, "Internal Server Error: Something went wrong."));
    }
};

module.exports = { createPolicy, getAllPolicy, getByIdPolicy, updatePolicy, deletePolicy };