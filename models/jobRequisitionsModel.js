module.exports = (sequelize, Sequelize, DataTypes) => {
    const JobRequisition = sequelize.define('JobRequisition', {
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
        canEngageExternalConsultants: {
            type: DataTypes.STRING(10),
            defaultValue: null
        },
        priority: {
            type: DataTypes.STRING(10),
            defaultValue: null
        },
        company: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        noOfPositions: {
            type: DataTypes.INTEGER
        },
        remark: {
            type: DataTypes.STRING,
            defaultValue: null
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
        tableName: 'JobRequisitions',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        timestamps: true
    });

    JobRequisition.associate = function(models) {
        JobRequisition.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        JobRequisition.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        JobRequisition.belongsTo(models.MetaData, {
            as: 'jobType',
            foreignKey: {
                name: 'jobTypeId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        JobRequisition.belongsTo(models.MetaData, {
            as: 'jobRequisitionStatus',
            foreignKey: {
                name: 'jobRequisitionStatusId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        JobRequisition.hasMany(models.JobAssignment, {
            as: 'jobAssignments',
            foreignKey: {
                name: 'jobId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        JobRequisition.hasMany(models.Candidate, {
            as: 'candidates',
            foreignKey: {
                name: 'jobId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        JobRequisition.hasMany(models.JobAssignment, {
            as: 'users',
            foreignKey: {
                name: 'userId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        
    };

    return JobRequisition;
};