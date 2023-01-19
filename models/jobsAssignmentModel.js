module.exports = (sequelize, Sequelize, DataTypes) => {
    const JobAssignment = sequelize.define('JobAssignment', {
        jobAssignmentId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'Active'
        }
    }, {
        tableName: 'JobAssignments',
        createdAt: 'createdDate',
        updatedAt: 'lastModifiedDate',
        timestamps: true
    });

    JobAssignment.associate = function(models) {
        JobAssignment.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: {
                name: 'createdById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        JobAssignment.belongsTo(models.User, {
            as: 'lastModifiedBy',
            foreignKey: {
                name: 'lastModifiedById',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        JobAssignment.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                name: 'userId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });

        JobAssignment.belongsTo(models.JobRequisition, {
            as: 'job',
            foreignKey: {
                name: 'jobId',
                type: DataTypes.STRING(50),
                defaultValue: null
            }
        });
    };

    return JobAssignment;
};