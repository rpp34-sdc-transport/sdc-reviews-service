mongoimport --type csv -d atelierReviews -c review_characterstics --headerline --drop extractedData/characteristic_reviews.csv --numInsertionWorkers=4

mongoimport --type csv -d atelierReviews -c characteristics_descriptions --headerline --drop extractedData/characteristics.csv --numInsertionWorkers=4

mongoimport --type csv -d atelierReviews -c review_photos --headerline --drop extractedData/reviews_photos.csv --numInsertionWorkers=4

mongoimport --type csv -d atelierReviews -c reviews --headerline --drop extractedData/reviews.csv --numInsertionWorkers=4