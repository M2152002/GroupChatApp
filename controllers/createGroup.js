const Message = require('../models/messages');
const User = require('../models/userDetails');
const group = require('../models/group');
const userGroups = require('../models/userGroups');
const sequelize = require('../util/database');

exports.saveGroupName = async function (req, res) {
    // console.log(req.body);
    group_name = req.body.groupName;
    adminId = req.body.userId;
    // console.log(group_name)
    try {
        const result = await group.create({ group_name, adminId })
        // console.log("result>>>>>123456",result);
        const groupGroupId = result.dataValues.groupId;
        // console.log(result.dataValues.group_name)
        console.log("userListUserId",userListUserId);
        console.log("groupgroupid", groupGroupId);
        const userListUserId = result.dataValues.adminId;
        // const result2 = await userGroups.create({ userListUserId, groupGroupId, userDetailId:userListUserId });
        const result2 = await userGroups.create({ userListUserId, groupGroupId })
        // console.log(result2);
        res.status(200).json({ result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }

}

exports.fetchGroups = async function (req, res) {
    // console.log("Request to fetch groups for user ID:", req.params.id);
    try {
        const result = await userGroups.findAll({
            where: {
                userListUserId: req.params.id
            },
            include: [
                {
                    model: group,
                    as: 'group', 
                    attributes: ['group_name'],
                },
            ],
        });
        console.log("result after querry",result);
        const groupNames = result.map(userGroup => userGroup.group.group_name);

        // console.log(groupNames);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.fetchAllUsers = async function (req, res) {
    // console.log('req reaching the server');

    try {
        const result = await User.findAll({
            attributes: ['name', 'email', 'userId'],
        });

        console.log(result);
        res.status(200).json({ result });
    } catch (error) {
        console.log(error);
    }
}