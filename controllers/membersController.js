const Member = require('../models/membersmodel');

async function addMemeber(req, res) {
    try {
        const { userId, members } = req.body;
        const existingMember = await Member.findOne({ userId });

        if (existingMember) {
            existingMember.members.push(...members);
            await existingMember.save();
            res.status(200).json({ message: 'Members added successfully' });
        } else {
            const newMember = new Member({ userId, members });
            await newMember.save();
            res.status(201).json({ message: 'Member created successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}

async function deleteMemeber(req, res) {
    try {
        const memberId = req.params.id;
        const { userId } = req.body;
        const documents = await Member.find({ userId: userId });
        if (!documents || documents.length === 0) {
            return res.status(404).json({ message: 'Document(s) not found' });
        }
        for (const document of documents) {
            const memberIndex = document.members.findIndex(member => member._id.toString() === memberId);
            if (memberIndex !== -1) {
                document.members.splice(memberIndex, 1);
                await document.save();
            }
        }
        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}

async function getMemeber(req, res) {
    try {
        const members = await Member.find({userId:req.params.id});
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }

}
module.exports = { addMemeber, getMemeber, deleteMemeber };