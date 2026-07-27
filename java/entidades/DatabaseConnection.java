package entidades;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseConnection {
    private static final String URL = "jdbc:sqlserver://localhost:1433;databaseName=Monjarrez;user=webuser;password=.JLIrrez19MonADONAI7JLI.;encrypt=true;trustServerCertificate=true;";

    public DatabaseConnection() {
    }

    public static Connection getConnection() {
        Connection connection = null;
        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver"); // Carga del driver

            connection = DriverManager.getConnection(URL);
            System.out.println("Conexión exitosa a la base de datos.");
        } catch (Exception e) {
            System.err.println("Error al conectar a la base de datos: " + e.getMessage());
            e.printStackTrace();
            System.err.println("Error al conectar a la base de datos desde Tomcat: " + e.getMessage());
            e.printStackTrace();

        }
        return connection;
    }
}
