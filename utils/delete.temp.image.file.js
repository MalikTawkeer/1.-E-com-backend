import { log } from "console";
import fs, { unlink } from "fs";

/**
 * Delete multiple files from the server.
 * @param {Array} filesToDelete Array of file paths to delete.
 * @returns {Promise<Array>} Promise that resolves with an array of deleted file paths.
 */

async function deleteFiles(filesToDelete) {
  const deleteOperations = [];

  try {
    //If we hv multiple to delete, The Loop through each file and create a delete operation
    filesToDelete.forEach((file) => {
      const filePath = file.path;

      // Create a promise for each delete operation
      const deletePromise = new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject({ path: filePath, error: err.message });
          } else {
            resolve({ path: filePath });
          }
        });
      });

      deleteOperations.push(deletePromise);
    });

    // Execute all delete operations concurrently
    const results = await Promise.all(deleteOperations);

    return results;
  } catch (error) {
    console.log(error, "ERROR:: deleting images");
  }
}

export default deleteFiles;
