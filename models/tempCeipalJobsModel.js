module.exports = (sequelize, Sequelize, DataTypes) => {
    const TempCeipalJob = sequelize.define('TempCeipalJob', {
        jobId: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        jobCode: {
            type: DataTypes.STRING(20),
            defaultValue: null
        },
        jobTitle: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        city: {
            type: DataTypes.STRING(40),
            defaultValue: null
        },
        state: {
            type: DataTypes.STRING(40),
            defaultValue: null
        },
        primarySkills: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        experience: {
            type: DataTypes.STRING(30),
            defaultValue: null
        },
        payRates: {
            type: DataTypes.JSON, 
            defaultValue: null
        },
        company: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        noOfPositions: {
            type: DataTypes.INTEGER
        },
        jobDescription: {
            type: DataTypes.TEXT,
            defaultValue: null
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'tempceipaljobs',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        timestamps: true
    });

    return TempCeipalJob;
};