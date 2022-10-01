const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../utils/connectingToDatabase")


const time_dim = sequelize.define('time_dim', {
    date_dim_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    date_actual: {
        type: DataTypes.DATE,
        allowNull: false
    },
    epoch: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    day_suffix: {
        type: DataTypes.STRING(4),
        allowNull: false
    },
    day_name: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    day_of_month: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    day_of_quarter: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    day_of_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    week_of_month: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    week_of_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    week_of_year_iso: {
        type: DataTypes.CHAR(10),
        allowNull: false
    },
    month_actual: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    month_name: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    month_name_abbreviated: {
        type: DataTypes.CHAR(3),
        allowNull: false
    }, 
    quarter_actual: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quarter_name: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    year_actual: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    first_day_of_week: {
        type: DataTypes.DATE,
        allowNull: false
    },
    last_day_of_week: {
        type: DataTypes.DATE,
        allowNull: false
    },
    first_day_of_month: {
        type: DataTypes.DATE,
        allowNull: false
    },
    last_day_of_month: {
        type: DataTypes.DATE,
        allowNull: false
    },
    first_day_of_quarter: {
        type: DataTypes.DATE,
        allowNull: false
    },
    last_day_of_quarter: {
        type: DataTypes.DATE,
        allowNull: false
    },
    first_day_of_year: {
        type: DataTypes.DATE,
        allowNull: false
    },
    last_day_of_year: {
        type: DataTypes.DATE,
        allowNull: false
    },
    mmyyyy: {
        type: DataTypes.CHAR(6),
        allowNull: false
    },
    mmddyyyy: {
        type: DataTypes.CHAR(10),
        allowNull: false
    },
    weekend_indr: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    } 
}, {
    timestamps: false
});


module.exports = time_dim;