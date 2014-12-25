// --------------------------------------- SQL-Functions ----------------------------------------------------- //

function executeUpdate(strSQL) {
    try {
        var conn = $.db.getConnection(strDashboardUser);
        var pstmt = conn.prepareStatement(strSQL);
        var updateCount = pstmt.executeUpdate();
        conn.commit();
        return updateCount;
    } catch (err) {
        return err.message;
    }
}

function executeQuery(strSQL) {
    try {
        var conn = $.db.getConnection(strDashboardUser);
        var pstmt = conn.prepareStatement(strSQL);
        var updateCount = pstmt.executeQuery();
        conn.commit();
        return updateCount;
    } catch (err) {
        return err.message;
    }
}

function executeStoredProc(strSQL) {
    try {
        var conn = $.db.getConnection(strDashboardUser);
        var pstmt = conn.prepareCall(strSQL);
        var updateCount = pstmt.execute();
        conn.commit();
        return updateCount;
    } catch (err) {
        return err.message;
    }
}


function executeReader(strSQL) {
    try {
        var conn = $.db.getConnection(strDashboardUser);
        var pstmt = conn.prepareStatement(strSQL);
        var rs = pstmt.executeQuery();
        return rs;
    } catch (err) {
        return err.message;
    }
}


function executeScalar(strSQL) {

    try {
        var conn = $.db.getConnection(strDashboardUser);
        var pstmt = conn.prepareStatement(strSQL);
        var rs = pstmt.executeQuery();
        var retVal;

        if (!rs.next()) {
            retVal = '';
        } else {
            retVal = rs.getString(1).replace("'", "\'");
        }

        rs.close();
        pstmt.close();
        conn.close();

        return retVal;
    } catch (err) {
        return '';
    }
}

function executeRecordSet(strSQL) {
    try {
        var conn = $.db.getConnection(strDashboardUser);
        var pstmt = conn.prepareStatement(strSQL);
        var rs = pstmt.executeQuery();
        var rsm = rs.getMetaData();
        var intCount = 0;
        var htmlTable = '';

        if (!rs.next()) {
            htmlTable += '<table class=\'w-recordset-table\'><tr>';

            //Get the table data + header
            for (var i = 1; i <= rsm.getColumnCount(); i++) {
                htmlTable += '<th align=\'left\'>' + rsm.getColumnName(i) + '</th>';
            }

            htmlTable += '</tr>';
            while (rs.next()) {
                htmlTable += '<tr>';
                for (var i = 1; i <= rsm.getColumnCount(); i++) {
                    htmlTable += '<td align=\'left\'>';
                    htmlTable += rs.getString(i);
                    htmlTable += '</td>';
                }
                htmlTable += '</tr>';
            }
            htmlTable += '</table>';

            rs.close();
        }

        pstmt.close();
        conn.close();

        return htmlTable;
    } catch (err) {
        return err.message;
    }

}


function executeRecordSetObjCALL(strSQL, strSP) {
    //Not sure if this is being used any longer  

    try {
        var conn = $.db.getConnection(strDashboardUser);

        if (strSP == true) {
            var pstmt = conn.prepareCall(strSQL);
            var rs = pstmt.getRecordSet();
        } else {
            var rs = pstmt.executeQuery();
        }
        var rsm = rs.getMetaData();
        var strObj = '';

        if (!rs.next()) {
            while (rs.next()) {
                strObj += '{';
                for (var i = 1; i <= rsm.getColumnCount(); i++) {
                    strObj += '"' + rsm.getColumnLabel(i) + '":"' + rs.getString(i) + '",';
                }
                strObj = strObj.substring(0, strObj.length - 1);
                strObj += '},'
            }
            rs.close();
        }
        pstmt.close();
        conn.close();

        return '[' + strObj.substring(0, strObj.length - 1) + ']';
    } catch (err) {
        return err.message;
    }
}

function executeRecordSetObj(strSQL) {
    try {
        var conn = $.db.getConnection(strDashboardUser);
        //conn.prepareStatement("SET SCHEMA \"METRIC2\"").execute();  
        var pstmt = conn.prepareStatement(strSQL);
        var rs = pstmt.executeQuery();
        var rsm = rs.getMetaData();
        var strObj = '';

        while (rs.next()) {
            strObj += '{';
            for (var i = 1; i <= rsm.getColumnCount(); i++) {
                var value;

                switch (rsm.getColumnType(i)) {
                    case $.db.types.VARCHAR:
                    case $.db.types.CHAR:
                        value = rs.getString(i);
                        break;
                    case $.db.types.NVARCHAR:
                    case $.db.types.NCHAR:
                    case $.db.types.SHORTTEXT:
                        value = rs.getNString(i);
                        break;
                    case $.db.types.TINYINT:
                    case $.db.types.SMALLINT:
                    case $.db.types.INT:
                    case $.db.types.BIGINT:
                        value = rs.getInteger(i);
                        break;
                    case $.db.types.DOUBLE:
                        value = rs.getDouble(i);
                        break;
                    case $.db.types.DECIMAL:
                        value = rs.getDecimal(i);
                        break;
                    case $.db.types.REAL:
                        value = rs.getReal(i);
                        break;
                    case $.db.types.NCLOB:
                    case $.db.types.TEXT:
                        value = rs.getNClob(i);
                        break;
                    case $.db.types.CLOB:
                        value = rs.getClob(i);
                        break;
                    case $.db.types.BLOB:
                        value = $.util.convert.encodeBase64(rs.getBlob(i));
                        break;
                    case $.db.types.DATE:
                        value = rs.getDate(i);
                        break;
                    case $.db.types.TIME:
                        value = rs.getTime(i);
                        break;
                    case $.db.types.TIMESTAMP:
                        value = rs.getTimestamp(i);
                        break;
                    case $.db.types.SECONDDATE:
                        value = rs.getSeconddate(i);
                        break;
                    default:
                        value = rs.getString(i);
                }

                strObj += '"' + rsm.getColumnLabel(i) + '":"' + value + '",';
            }
            strObj = strObj.substring(0, strObj.length - 1);
            strObj += '},'
        }
        rs.close();
        pstmt.close();
        conn.close();

        return '[' + strObj.substring(0, strObj.length - 1) + ']';
    } catch (err) {
        return err.message;
    }
}

function executeInputQuery(SQL) {
    try {
        var rs = 0;
        var conn = $.db.getConnection(strDashboardUser);
        if (SQL.indexOf(";") > 0) {
            var ss = SQL.split(";");
            var sql2 = '';
            var i = 0;
            for (i in ss) {
                sql2 = ss[i].replace(";", "");
                if (sql2.length > 0) {
                    var pstmt = conn.prepareStatement(decodeURIComponent(sql2));
                    rs = pstmt.executeUpdate();
                    conn.commit();
                }
            }
        } else {
            var pstmt = conn.prepareStatement(decodeURIComponent(SQL));
            rs = pstmt.executeUpdate();
            conn.commit();
        }
        return rs;
    } catch (err) {
        return err;
    }
}


// --------------------------------------- End SQL-Functions ----------------------------------------------------- //