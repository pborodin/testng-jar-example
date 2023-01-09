package my.home;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.*;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static my.home.Config.TEST_CONFIG_FOLDER;

public class FileService {

/*    public static boolean isFileExists(Path path) {
        if(path == null) {
            System.out.println("Путь к файлу == NULL!");
            return false;
        }
        boolean fileExists = Files.exists(path);
        if(!fileExists) System.out.println("Файл не найден! " + path);
        System.out.println("Файл найден: " + path);
        return fileExists;
    }*/

    public static Path getAbsolutePathToFile(String fileName) {
        fileName = fileName.replaceAll("\\\\", "/");

        Path path = null;
        try {
            URI uri = FileService.class.getProtectionDomain().getCodeSource().getLocation().toURI();
            File file = new File(uri.getPath());
            String basePath = file.getPath();
            if(basePath.contains(".jar")) basePath = file.getParent();
            uri = uri.resolve(Paths.get(basePath).toUri() + fileName);

            path = Paths.get(uri);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        return path;
    }

  /*  public static Set<String> getListOfFiles(Path dir, int depth) {
        try (Stream<Path> stream = Files.walk(dir, depth)) {
            return stream
                    .filter(file -> !Files.isDirectory(file))
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .collect(Collectors.toSet());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }*/

    public static Set<String> getListOfTestConfigFiles() {
        Path path = FileService.getAbsolutePathToFile(TEST_CONFIG_FOLDER);
        try (Stream<Path> stream = Files.walk(path, 10)) {
            return stream
                    .filter(file -> !Files.isDirectory(file))
//                    .map(Path::getFileName)
                    .map(p -> path.relativize(p))
                    .map(Path::toString)
                    .collect(Collectors.toSet());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
