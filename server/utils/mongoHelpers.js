const attachCleanJsonTransform = (schema) => {
    schema.set("toJSON", {
        versionKey: false,
        transform: (_, ret) => {
            delete ret._id;
            return ret;
        }
    });

    schema.set("toObject", {
        versionKey: false,
        transform: (_, ret) => {
            delete ret._id;
            return ret;
        }
    });

    return schema;
};

const getNextNumericId = async (Model) => {
    const lastRecord = await Model.findOne().sort({ id: -1 }).select("id").lean();
    return lastRecord?.id ? lastRecord.id + 1 : 1;
};

module.exports = {
    attachCleanJsonTransform,
    getNextNumericId,
};

