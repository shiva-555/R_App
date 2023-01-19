module.exports = (sequelize, Sequelize, DataTypes) => {
    const Interview = sequelize.define('Interview', {
        interviewId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        interviewRound: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        panelEmail: {
            type: DataTypes.STRING(100),
            defaultValue: null
        },
        interviewStatus: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        isFinalSelected: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        interviewDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        interviewStartTime: {
            type: DataTypes.TIME,
            defaultValue: null
        },
        interviewDuration: {
            type: DataTypes.FLOAT,
            defaultValue: null
        },
        interviewBody: {
            type: DataTypes.TEXT,
            defaultValue: null
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'Interviews',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        timestamps: true
    });

    Interview.associate = function (models) {
        Interview.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        Interview.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        // Interview.belongsTo(models.MetaData, {
        //     as: 'interviewStatus',
        //     foreignKey: {
        //         name: 'interviewStatusId',
        //         type: DataTypes.UUID,
        //         defaultValue: null
        //     }
        // });

        Interview.belongsTo(models.Candidate, {
            as: 'candidate',
            foreignKey: {
                name: 'candidateId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        Interview.belongsTo(models.JobRequisition, {
            as: 'jobTitle',
            foreignKey: {
                name: 'jobId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });
    };

    return Interview;
};