const Category = require('../models/category.model');
const User = require('../models/user.model');
const Submission = require('../models/submission.model');
const News = require('../models/news.model');
const Tag = require('../models/tag.model');

const getStats = async (req, res) => {
    try {
        const [
            categoryCount,
            userCount,
            submissionCount,
            tagCount,
            articleCount,
            newsCount
        ] = await Promise.all([
            Category.countDocuments(),
            User.countDocuments(),
            Submission.countDocuments(),
            Tag.countDocuments(),
            News.countDocuments({ type: 'article' }),
            News.countDocuments({ type: 'news' })
        ]);

        res.status(200).send({
            message: 'Statistics fetched successfully',
            data: {
                totalCategories: categoryCount,
                totalUsers: userCount,
                totalSubmissions: submissionCount,
                totalTags: tagCount,
                totalArticles: articleCount,
                totalNews: newsCount
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'An error occurred while fetching statistics.',
            error: error.message
        });
    }
};

module.exports = {
    getStats
};