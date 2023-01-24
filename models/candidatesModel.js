module.exports = (sequelize, Sequelize, DataTypes) => {
    const Candidate = sequelize.define('Candidate', {
        candidateId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        candidateName: {
            type: DataTypes.STRING(100),
            defaultValue: null
        },
        candidateEmail: {
            type: DataTypes.STRING(100),
            defaultValue: null
        },
        candidatePhone: {
            type: DataTypes.BIGINT,
            defaultValue: null
        },
        candidateType: {
            type: DataTypes.BOOLEAN,
            defaultValue: null
        },
        gender: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        candidateLastWorkingDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        identifiedDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        candidateCallingDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        selectedRejectedDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },

        offerDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        documentVerificationInitiatedOn: {
            type: DataTypes.DATE,
            defaultValue: null
        },

        otherSource: {
            type: DataTypes.TEXT,
            defaultValue: null
        },

        totalExperience: {
            type: DataTypes.FLOAT,
            defaultValue: null
        },
        relevantExperience: {
            type: DataTypes.FLOAT,
            defaultValue: null
        },
        offeredSalary: {
            type: DataTypes.FLOAT,
            defaultValue: null
        },
        tentativeDateOfJoining: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        joiningDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        currentCTC: {
            type: DataTypes.FLOAT,
            defaultValue: null
        },
        expectedCTC: {
            type: DataTypes.FLOAT,
            defaultValue: null
        },
        noticePeriodInDays: {
            type: DataTypes.FLOAT,
            defaultValue: null
        },
        remark: {
            type: DataTypes.TEXT,
            defaultValue: null
        },
        company: {
            type: DataTypes.STRING(100),
            defaultValue: null
        },
        documents: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        joiningDetails: {
            type: DataTypes.JSON,
            defaultValue: null
        },
        reportingManager: {
            type: DataTypes.STRING(100),
            defaultValue: null
        },
        isReferal: {
            type: DataTypes.BOOLEAN,
            defaultValue: null
        },
        keySkills: {
            type: DataTypes.TEXT,
            defaultValue: null
        },

        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'candidates',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        timestamps: true
    });

    Candidate.associate = function (models) {
        Candidate.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        Candidate.belongsTo(models.User, {
            as: 'hr',
            foreignKey: {
                name: 'hrId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        Candidate.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });


        Candidate.belongsTo(models.MetaData, {
            as: 'candidateStatus',
            foreignKey: {
                name: 'candidateStatusId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        Candidate.belongsTo(models.JobRequisition, {
            as: 'jobTitle',
            foreignKey: {
                name: 'jobId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        Candidate.belongsTo(models.MetaData, {
            as: 'jobLocation',
            foreignKey: {
                name: 'jobLocationId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        Candidate.belongsTo(models.MetaData, {
            as: 'source',
            foreignKey: {
                name: 'sourceId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        Candidate.belongsTo(models.MetaData, {
            as: 'backoutReason',
            foreignKey: {
                name: 'backoutReasonId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        Candidate.hasMany(models.Interview, {
            as: 'interviews',
            foreignKey: {
                name: 'candidateId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });

        Candidate.hasMany(models.CandidateStatusHistory, {
            as: 'statusHistory',
            foreignKey: {
                name: 'candidateId',
                type: DataTypes.UUID,
                defaultValue: null
            }
        });
    };

    return Candidate;
};