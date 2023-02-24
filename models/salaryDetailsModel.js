
module.exports=(sequelize,Sequelize,DataTypes)=>{
    const Salary =sequelize.define('Salary',{
        CandidateSalaryId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
         
        basicMonthlyWithPf:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        basicYearlyWithPf:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        basicMonthlyWithoutPf:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        basicYearlyWithoutPf:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        hraWithPFMonthly:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        hraWithPFYearly:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        hraWithoutPFMonthly:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        hraWithoutPFYearly:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },
        
        employerContributionPFMonth:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        employerContributionPFYearly:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        employerContributionPfWithoutPfMonth:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        employerContributionPfWithoutPfYear:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },


        specialAllowancewithPfMonthly:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        specialAllowancewithPfYearly:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },


        specialAllowancewithoutPfMonthly:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        specialAllowancewithoutPfYearly:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },


        GrossSalaryMonthWithPf:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        GrossSalaryYearWithPf:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },


        GrossSalaryMonthWithoutPf:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        GrossSalaryYearWithoutPf:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },


        employeeContributionwithPfYear:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        employeeContributionwithPfMonth:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },


        employerContributionPfWithoutPfYear:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        employerContributionPfWithoutPfMonth:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        netPayTaxwithPfMonth:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        netPayTaxwithoutPfMonth:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        costToCompany:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },

        Template:{
            type:DataTypes.TEXT,
            defaultValue:null
        },

        variablepay:{
            type:DataTypes.FLOAT,
            defaultValue:null
        },

    }
    )
    
    return Salary;
}

