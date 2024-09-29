const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkID);
router.route('/top-5-cheap')
.get(tourController.get_top_cheap, tourController.getAllTours)
router.route('/tours-stat')
.get(tourController.getToursStat);
router.route('/monthly-plan/:year')
.get(tourController.monthly_plan)
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
