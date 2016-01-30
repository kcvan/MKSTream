angular.module('utils.fileUpload', ['utils.fileReader'])

.factory('fileUpload', ['fileReader', 'fileTransfer', function(fileReader, fileTransfer) {
  var fileUploadObj = {};

  fileUploadObj.getFiles = function() {
    return document.getElementById('filesId').files;
  };

  fileUploadObj.convertFromBinary = function(data) {
    var kit = {};
    kit.href = URL.createObjectURL(data.file);
    kit.name = data.name;
    kit.size = data.size;
    return kit;
  };

  fileUploadObj.convert = function(num) {
    if (num > 1000000000) {
      return (num / 1000000000).toFixed(2) + ' GB'
    } else if (num > 1000000) {
      return (num / 1000000).toFixed(2) + ' MB'
    } else {
      return (num / 1000).toFixed(2) + ' KB'
    }
  };

  fileUploadObj.acceptFileOffer = function(offer) {
    offer.conn.send({
      name: offer.name,
      size: offer.rawSize,
      type: 'file-accepted'
    });
    var index = fileTransfer.offers.indexOf(offer);
    fileTransfer.offers.splice(index, 1);
  };

  fileUploadObj.rejectFileOffer = function(offer) {
    var index = fileTransfer.offers.indexOf(offer);
    fileTransfer.offers.splice(index, 1);
  };
  fileUploadObj.getTransferRate = function(transferObj) {
    var currentTime = Date.now();
    var timeToWait = 100; // ms
    if (currentTime >= transferObj.nextTime) {
      transferObj.nextTime = Date.now() + timeToWait;
      var pastBytes = transferObj.stored;
      transferObj.stored = transferObj.progress;
      var rate = ((transferObj.stored - pastBytes)) / (timeToWait) // B/ms (KB/s)
      console.log('CURRENT BYTES', transferObj.stored);
      console.log('PASTCOUNT', pastBytes);
      console.log('DIFFERENCE', transferObj.stored - pastBytes);
      var maxFileSize = transferObj.size;
      timeRemaining = (maxFileSize - transferObj.stored) / rate; // bytes / bytes/ms -> ms
      console.log('maxFileSize', maxFileSize);
      console.log('REMAINING BYTES', maxFileSize - transferObj.stored);
      var convertedRate = function(rate) {
        if (rate > 1000) {
          return (rate / 1000).toString() + ' MB/s';
        } else {
          return (rate.toString() + " KB/s")
        }
      }
      console.log('RATE:', convertedRate(rate));
      console.log('TIME REMAINING:', (timeRemaining / 1000).toFixed(0), 's')
    }
  }

  return fileUploadObj;

}]);
