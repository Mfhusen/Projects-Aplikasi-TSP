// Deklarasi Variabel Global
var map;
var garisPolyline;
var directionsService;
var directionsDisplay = null;

var nodes = [];
var nodeSebelumnya = [];
var penanda = [];

var tujuan = [];
var jarak = [];

var tujuanDefault = [
  ["Istana Anak-Anak Indonesia", -6.302011, 106.900207],
  ["Anjungan Bali", -6.302664, 106.897567],
  ["Sasono Adiguno TMII", -6.301907, 106.891441],
  ["Museum HAKKA Indonesia", -6.305194, 106.903967],
  ["Teater IMAX Keong Emas", -6.304473, 106.890819],
  ["Museum Indonesia", -6.301047, 106.891444],
  ["Museum Purna Bakti Pertiwi", -6.300346, 106.886441],
];

var lokasiDefault = false;

// Mengambil Nilai dari Lokasi Tujuan Default
var hitung_konten_lokasi = $(".lokasi-tujuan").length - 1;

function lokasiAutocomplete() {
  // Mendapatkan nama tempat dengan fitur autocomplete dari google maps api berdasarkan nama alamat lokasi
  for (var i = 0; i < inputs.length; i++) {
    var autocomplete = new google.maps.places.Autocomplete(inputs[i], {
      types: ["address"],
      componentRestrictions: { country: "idn" },
    });
    autocomplete.inputId = inputs[i].id;
    autocomplete.addListener("place_changed", fillIn);
    autocompletes.push(autocomplete);
  }

  for (var i = 0; i < inputs.length; i++) {
    var autocomplete = new google.maps.places.Autocomplete(inputs[i], {
      types: ["geocode"],
      componentRestrictions: { country: "idn" },
    });
    autocomplete.inputId = inputs[i].id;
    autocomplete.addListener("place_changed", fillIn);
    autocompletes.push(autocomplete);
  }

  for (var i = 0; i < inputs.length; i++) {
    var autocomplete = new google.maps.places.Autocomplete(inputs[i], {
      types: ["establishment"],
      componentRestrictions: { country: "idn" },
    });
    autocomplete.inputId = inputs[i].id;
    autocomplete.addListener("place_changed", fillIn);
    autocompletes.push(autocomplete);
  }

  function fillIn() {
    var id = this.inputId;
    var place = this.getPlace();
    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();

    $("#" + id + "_latitude").val(latitude);
    $("#" + id + "_longitude").val(longitude);
  }
}

// Membuat Fungsi Untuk Mengisi Default Lokasi Tujuan Pada Input Box
function isiLokasiDefault() {
  if (!lokasiDefault) {
    for (var i = 0; i < tujuanDefault.length; i++) {
      if (i > 0) {
        hitung_konten_lokasi++;
        var kontenLokasi =
          '<div class="lokasi-tujuan" id="lokasi-tujuan-' +
          hitung_konten_lokasi +
          '">' +
          '<input type="text" class="lokasi_tujuan m-wrap" autocomplete="off" id="lokasi_tujuan_' +
          hitung_konten_lokasi +
          '" data-id="' +
          hitung_konten_lokasi +
          '">' +
          '<input type="hidden" id="lokasi_tujuan_' +
          hitung_konten_lokasi +
          '_latitude" autocomplete="off">' +
          '<input type="hidden" id="lokasi_tujuan_' +
          hitung_konten_lokasi +
          '_longitude" autocomplete="off">' +
          '<button type="button" class="hapus_lokasi_tujuan" data-id="' +
          hitung_konten_lokasi +
          '">' +
          "Hapus" +
          "</button>" +
          "</div>";
        $("div.lokasi-tujuan").last().after(kontenLokasi);
      }

      // Menampilkan nama lokasi tujuan default pada input box
      $("lokasi_tujuan_" + i).val(tujuanDefault[i][0]);
      $("lokasi_tujuan_" + i + "_latitude").val(tujuanDefault[i][1]);
      $("lokasi_tujuan_" + i + "_longitude").val(tujuanDefault[i][2]);
    }

    var inputs = document.getElementsByClassName("lokasi_tujuan");
    var autocompletes = [];

    lokasiAutocomplete();

    tujuan = tujuanDefault;
    lokasiDefault = true;
  }
}

// Menampilkan tujuan default saat tombol Default Lokasi di klik
$(document).on("click", "#default_lokasi_tujuan", function () {
  isiLokasiDefault();
});

// Fungsi Autocomplete lokasi untuk input box tujuan pertama
var lokasi_tujuan = new google.maps.places.Autocomplete(
  document.getElementById("lokasi_tujuan_0"),
  {
    types: ["establishment"],
    componentRestrictions: { country: "idn" },
  }
);

lokasi_tujuan.addListener("place_changed", function () {
  var place = lokasi_tujuan.getPlace();
  var latitude = place.geometry.location.lat();
  var longitude = place.geometry.location.lng();
  $("#lokasi_tujuan_0_latitude").val(latitude);
  $("#lokasi_tujuan_0_longitude").val(longitude);
});

// Membuat berbagai fungsi untuk tombol serta input box tujuan
var hitung_konten_lokasi = $(".lokasi-tujuan").length - 1;

// Membuat berbagai fungsi untuk tombol tambah lokasi
$(document).on("click", "#tambah_lokasi_tujuan", function () {
  // Membuat sebuah alert box ketika input box kosong dan tombol tambah lokasi dijalankan
  if ($("lokasi_tujuan_" + hitung_konten_lokasi).val() == "") {
    alert("Silahkan Masukkan Tujuan! Input Box Tidak Boleh Kosong.");
    document.getElementById("lokasi_tujuan_" + hitung_konten_lokasi).focus();
    return false;
  }

  // Membuat sebuah alert box ketika lokasi tidak valid dan tombol tambah lokasi dijalnkan
  if (
    $("lokasi_tujuan_" + hitung_konten_lokasi + "_latitude").val() == "" &&
    $("lokasi_tujuan_" + hitung_konten_lokasi).val() != ""
  ) {
    alert("Lokasi Tidak Ditemukan! Silahkan Masukkan Lokasi Lainnya.");
    document.getElementById("lokasi_tujuan_" + hitung_konten_lokasi).focus();
    return false;
  }

  // Membuat alert box saat jumlah lokasi sudah mencapai limit
  if ($(".lokasi-tujuan").length == 9) {
    alert("Jumlah Lokasi Sudah Maksimal!");
    return;
  }

  hitung_konten_lokasi++;
  var kontenLokasi =
    '<div class="lokasi-tujuan" id="lokasi-tujuan-' +
    hitung_konten_lokasi +
    '">' +
    '<input type="text" class="lokasi_tujuan m-wrap" autocomplete="off" id="lokasi_tujuan_' +
    hitung_konten_lokasi +
    '" data-id="' +
    hitung_konten_lokasi +
    '">' +
    '<input type="hidden" id="lokasi_tujuan_' +
    hitung_konten_lokasi +
    '_latitude" autocomplete="off">' +
    '<input type="hidden" id="lokasi_tujuan_' +
    hitung_konten_lokasi +
    '_longitude" autocomplete="off">' +
    '<button type="button" class="hapus_lokasi_tujuan" data-id="' +
    hitung_konten_lokasi +
    '">' +
    "Hapus" +
    "</button>" +
    "</div>";
  $("div.lokasi-tujuan").last().after(kontenLokasi);

  var inputs = document.getElementsByClassName("lokasi_tujuan");
  var autocompletes = [];

  lokasiAutocomplete();
});

// Membuat fungsi untuk menghapus inpux box lokasi tujuan
$(document).on("click", ".hapus_lokasi_tujuan", function () {
  var id = $(this).data("id");
  $("$lokasi-tujaun-" + id).remove();
});

// Menampilkan google maps pada window
function initializeMap() {
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: { lat: -6.302478152274517, lng: 106.8951792972926 },
    zoom: 16,
    mapTypeId: "hybrid",
    streetViewControl: false,
    mapTypeControl: false,
  });
}

// Membuat fungsi untuk mendapatkan info tentang perjalanan berupa total durasi perjalanan dan waktu
function infoJarak(callback) {
  // Mendapatkan total perjalanan saat pencarian dimulai
  var service = new google.maps.DistanceMatrixService();
  var nodes = [];

  $(".lokasi-tujuan").each(function (i, obj) {
    var id = $(this).data("id");
    var latitude_tujuan = parseFloat(
      $("#lokasi_tujuan_" + id + "_latitude").val()
    );
    var longitude_tujuan = parseFloat(
      $("#lokasi_tujuan_" + id + "_longitude").val()
    );

    var infoLatLng = { lat: latitude_tujuan, lng: longitude_tujuan };
    nodes.push(infoLatLng);
  });

  // Mendapatkan total lokasi tujuan
  $("#jumlah-lokasi").html(nodes.length);

  service.infoJarakMatrix(
    {
      origins: nodes,
      destinations: nodes,
      travelMode: google.maps.TravelMode[$("#tipe-perjalanan").val()],
      avoidHighways: false,
      avoidTolls: false,
    },
    function (dataPerjalanan) {
      // Membuat data jarak pada array
      var nodeJarakData;
      for (originNodeIndex in dataPerjalanan.rows) {
        nodeJarakData = dataPerjalanan.rows[originNodeIndex].elements;
        jarak[originNodeIndex] = [];
        for (tujuanNodeIndex in nodeJarakData) {
          if (
            (jarak[originNodeIndex][tujuanNodeIndex] =
              nodeDataPerjalanan[tujuanNodeIndex].jarak == undefined)
          ) {
            alert("ERROR: Tidak bisa mendapatkan jarak perjalanan");
            return;
          }
          jarak[originNodeIndex][tujuanNodeIndex] =
            nodeJarakData[tujuanNodeIndex].jarak.value;
        }
      }

      if (callback != undefined) {
        callback();
      }
    }
  );
}

// Membuat fungsi untuk membersihkan penanda dari maps
function hapusPenandaMap() {
  for (index in penanda) {
    penanda[index].setMap(null);
  }

  nodeSebelumnya = nodes;
  nodes = [];

  if (garisPolyline != undefined) {
    garisPolyline.setMap(null);
  }

  penanda = [];

  $("#ga-buttons").show();
}

// Membuat fungsi untuk membersihkan petunjuk arah dari maps
function hapusPetunjukMap() {
  if (directionsDisplay != null) {
    directionsDisplay.setMap(null);
    directionsDisplay = null;
  }
}

// Membuat fungsi untuk membersihkan maps
function clearMap() {
  hapusPenandaMap();
  hapusPetunjukMap();

  $("#jumlah-lokasi").html("0");
}

// Inisialisasi tampilan google maps api pada window
google.maps.event.addDomListener(windows, "load", initializeMap);

// Membuat event listener untuk membersihkan maps
$("#clear-map").click(clearMap);

// Membuat event listener untuk menjalankan program dengan algoritma genetika
$("#cari-rute").click(function () {
  mulaiMap();
});

function mulaiMap() {
  $("#jarak-terbaik").html("?");
  $("#rangkuman-rute").html("?");
  $("#panel-petunjuk").hide();
  var nodes = [];

  // Mengambil nilai latitude dan longitude dari lokasi tujuan
  $(".lokasi-tujuan").each(function (i, obj) {
    var id = $(this).data("id");
    var lokasi_tujuan = $(this).val();
    var latitude_tujuan = parseFloat(
      $("#lokasi_tujuan_" + id + "_latitude").val()
    );
    var longitude_tujuan = parseFloat(
      $("#lokasi_tujuan_" + id + "_longitude").val()
    );

    var infoLatLng = { lat: latitude_tujuan, lng: longitude_tujuan };
    nodes.push(infoLatLng);
  });

  // Membuat alert saat lokasi tujuan kurang dari 2
  if (nodes.length < 2) {
    if (nodeSebelumnya.length >= 2) {
      nodes = nodeSebelumnya;
    } else {
      alert("Lokasi tujuan harus lebih dari 2 titik.");
      return;
    }
  }

  if (directionsDisplay != null) {
    directionsDisplay.setMap(null);
    directionsDisplay = null;
  }

  $("#ga-buttons").hide();

  // Mendapatkan durasi rute perjalanan
  infoJarak(function () {
    $(".info-algoritma").show();

    // Mengambil nilai config algoritma genetika dan membuat populasi algoritma genetika
    ga.getConfig();

    // Membuat class populasi pada algoritma genetika dan disimpan di variable pop
    var pop = new ga.population();

    // Inisialisasi populasi sesuai dengan panjang node
    pop.initialize(nodes.length);

    // Mengambil kromosom dengan nilai fittest terbaik lalu masukkan kedalam variable rute
    var rute = pop.getFittest().chromosome;

    // Memulai proses evolusi dari populasi awal
    ga.evolvePopulation(
      // populasi yang akan dievolusikan
      pop,
      function (update) {
        // Menampilkan total generasi yang sudah selesai
        $("#jumlah-generasi").html(update.generation);

        // Simpan kromosom dengan nilai fittest paling baik di generasi saat ini ke rute
        var rute = update.population.getFittest().chromosome;

        // Inisialisasi array ruteKoordinat berisi semua rute
        var ruteKoordinat = [];
        for (index in rute) {
          ruteKoordinat[index] = nodes[rute[index]];
        }

        // Menambahkan node di rute ke 0
        ruteKoordinat[rute.length] = nodes[rute[0]];

        // Membuat garis polyline dari ruteKoordinat setiap generasi di maps
        if (garisPolyline != undefined) {
          garisPolyline.setMap(null);
        }
        garisPolyline = new google.maps.Polyline({
          path: ruteKoordinat,
          strokeColor: "#0066ff",
          strokeOpacity: 0.75,
          strokeWeight: 2,
        });
        garisPolyline.setMap(map);
      },

      // generasi callback saat update generasi selesai
      function (result) {
        // Menyimpan kromosom dengan nilai fittest terbaik di generasi terakhir ke dalam rute
        rute = result.population.getFittest().chromosome;

        // Request direction ke google maps api
        directionsService = new google.maps.DirectionService();
        directionsDisplay = new google.maps.DirectionDisplay();
        directionsDisplay.setMap(map);

        // Menyimpan rute ke array waypts sesuai format untuk direction
        var waypts = [];
        for (var i = 1; i < rute.length; i++) {
          waypts.push({
            location: nodes[rute[i]],
            stopover: true,
          });
        }

        // Membuat request dengan origin node awal dari rute awal ke destinatisi
        var request = {
          origin: nodes[rute[0]],
          destination: nodes[rute[0]],
          waypoints: waypts,
          optimizeWaypoints: false,
          travelMode: google.maps.TravelMode[$("#tipe-perlanan").val()],
          avoidHighways: false,
          avoidTolls: false,
        };

        // Menampilkan response jika status dari google == OK
        directionsService.rute(request, function (response, status) {
          if (status == google.maps.DirectionService.OK) {
            directionsDisplay.setDirections(response);

            // Memampilkan huruf secara berurutan
            var huruf_sekarang = 0;
            function hurufBerikutnya() {
              huruf_sekarang++;
              var alphabet = String.fromCharCode(64 + huruf_sekarang);

              return alphabet;
            }

            // Inisialisasi rangkuman rute
            var rangkuman_rute = "";
            var total_jarak = 0;
            var rute_saya = response.rute[0];

            // Membuat looping untuk jumlah rute dan menambahkan semua rute ke total jarak. Lalu simpan jarak rute
            for (i = 0; i < rute_saya.legs.length; i++) {
              total_jarak += rute_saya.legs[i].distance.value;

              var jarak_rute = rute_saya.legs[i].distance.text;

              // Memampilkan urutan rute dan jarak jalan antar rute
              rangkuman_rute += "<p>";
              rangkuman_rute +=
                '<strong style="color: red;">' +
                hurufBerikutnya() +
                "</strong>." +
                rute_saya.legs[i].start_address;
              rangkuman_rute += "<br>";
              rangkuman_rute += "<strong>" + jarak_rute + " </strong>";
              rangkuman_rute += "</p>";

              // Memampilkan urutan rute dan jarak antar rute jika sudah berada pada rute terakhir
              if (i + 1 == rute_saya.legs.length) {
                rangkuman_rute += "<p>";
                rangkuman_rute +=
                  '<strong style="color: red;">' +
                  hurufBerikutnya() +
                  "</strong>." +
                  rute_saya.legs[i].end_address;
                rangkuman_rute += "<br>";
                rangkuman_rute += "<strong>" + jarak_rute + " </strong>";
                rangkuman_rute += "</p>";
              }
            }

            // Menampilkan jarak dan rangkuman rute
            var jarak = total_jarak / 1000;
            document.getElementById("jarak-terbaik").innerHTML = jarak + " KM";
            document.getElementById("rangkuman-rute").innerHTML =
              rangkuman_rute;

            // Menampilkan rute pada pedata dan juga panel petunjuk
            $("#panel-petunjuk").html("");
            directionsDisplay.set(map);
            directionsDisplay.setPanel(
              document.getElementById("panel-petunjuk")
            );

            // Menampilkan kondisi lalu lintas pada peta
            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
          }

          // Membersihkan marker jika ada
          clearMapMarkers();
        });
      }
    );
  });
}

// ---------------------------
// ---------------------------

// Membuat konfigurasi algoritma genetika

var konfigurasiGA = {
  crossoverRate: 0.5,
  mutationRate: 0.1,
  populationSize: 50,
  elitism: true,
  maxGenerations: 50,
  tickerSpeed: 60,

  // Mengambil nilai konfigurasi algoritma genetika dari form input box
  getConfig: function () {
    konfigurasiGA.crossoverRate = parseFloat($("#rasio-crossover").val());
    konfigurasiGA.mutationRate = parseFloat($("#rasio-mutasi").val());
    konfigurasiGA.populationSize = parseInt($("#jumlah-populasi").val()) || 50;
    konfigurasiGA.elitism = parseInt($("#elitism").val()) || false;
    konfigurasiGA.maxGenerations = parseInt($("#maxGenerations").val()) || 50;
  },

  evolvePopulation: function (
    population,
    generationCallBack,
    completeCallBack
  ) {
    // Inisialisasi generasi saat ini dengan nilai awal 1
    var evolveInterval = setInterval(function () {
      if (generationCallBack != undefined) {
        generationCallBack({
          population: population,
          generation: generation,
        });
      }

      // Melakukan crossover ke population
      population = population.crossover();
      population.mutate();
      generation++;

      // Menampilkan hasil dan memanggil completeCallback jika generation sudah lebih dari maxGeneration
      if (generation > konfigurasiGA.maxGenerations) {
        clearInterval(evolveInterval);

        if (completeCallBack != undefined) {
          completeCallBack({
            population: population,
            generation: generation,
          });
        }
      }
    }, konfigurasiGA.ticker);
  },

  // Untuk menyimpan semua individu dari populasi
  population: function () {
    this.individuals = [];

    // Inisialisasi populasi dari random individu sesuai dengan panjang kromosom
    this.initialize = function (chromosomeLength) {
      this.individuals = [];

      // Inisialisasi individu sesuai dengan panjang kromosom yang didapatkan dari panjang node
      for (var i = 0; i < konfigurasiGA.populationSize; i++) {
        var individuBaru = new konfigurasiGA.individual(chromosomeLength);
        individuBaru.initialize();
        this.individuals.push(individuBaru);
      }
    };

    // Membuat mutasi pada populasi saat ini
    this.mutate = function () {
      // Cari fittestIndex kemudim simpan
      var fittestIndex = this.getFittestIndex();

      // Looping semua individu yang tersedia
      for (index in this.individuals) {
        if (konfigurasiGA.elitism != true || index != fittestIndex) {
          this.individuals[index].mutate();
        }
      }
    };

    // Menerapkan crossover pada populasi saat ini dan mengembalikan populasi turunan(offspring)
    this.crossover = function () {
      // Membuat populasi turunan
      var populasiBaru = new konfigurasiGA.pop();
      var fittestIndex = this.getFittestIndex();

      for (index in this.individuals) {
        // Menambahkan individu yang tidak berubah ke dalam generasi selanjutnya jika merupakan elite individual dan elitism enabled
        if (konfigurasiGA.elitism == true && index == fittestIndex) {
          // Replicate individual saat ini ke elite individual
          var eliteIndividual = new konfigurasiGA.individual(
            this.individuals[index].chromosomeLength
          );
          // SetChromosome elite individual dengan kromodom dari individual sekarang
          eliteIndividual.setChromosome(
            this.individuals[index].chromosome.slice()
          );
          // Menambahkan elite individual ke populasi baru
          populasiBaru.addIndividual(eliteIndividual);
        } else {
          // Jika tidak maka lakukan roullete wheel selection
          var parent = this.rouletteWheelSelection();
          this.individuals[index].crossover(parent, populasiBaru);
        }
      }

      return populasiBaru;
    };

    // Menambahkan individual ke populasi saat ini
    this.addIndividual = function (individual) {
      this.individuals.push(individual);
    };

    // Membuat fungsi roullete wheel selection dan memilih individu
    this.rouletteWheelSelection = function () {
      var totalFitness = 0;
      var fitness = [];

      for (var i = 0; i < this.individuals.length; i++) {
        fitness[i] = this.individuals[i].calcFitness();
        totalFitness += fitness[i];
      }

      // Inisialisasi array P & C
      var P = [];
      var C = [];

      // Looping sebanyak jumlah individual
      for (var i = 0; i < this.individuals.length; i++) {
        // Mencari nilai untuk P
        P[i] = fitness[i] / totalFitness;

        if (i == 0) {
          C[i] = P[i];
        } else if (i == this.individuals.length) {
          C[i] = 1;
        } else {
          C[i] = C[i - 1] + P[i];
        }
      }

      // Inisialisasi array R dan roullete wheel population
      var R = [];
      var rouletteWheelPopulation = new konfigurasiGA.population();
      for (var i = 0; i < this.individuals.lengthl; i++) {
        // Mengisi nilai R dengan nilai random dari 0 - 1
        R[i] = Math.random();
        // Looping sebanyak jumlah array C
        for (var j = 0; j < C.length; j++) {
          // Jika R lebih kecil dari C[j] maka tambahkan individual ke roullete wheel population
          if (R[i] <= C[j]) {
            rouletteWheelPopulation.addIndividual(this.individuals[j]);
            break;
          }
        }
      }
      // Mencari nilai getFittest dari roullete wheel population kemudian kembalikan
      return rouletteWheelPopulation.getFittest();
    };

    this.getFittestIndex = function () {
      var fittestIndex = 0;

      // Looping sebanyak jumlah individu untuk mencari fittest index
      for (var i = 1; i < this.individuals.length; i++) {
        // Jika nilai fitness individu lebih besar dari nilai fittestrIndex saat ini maka ubah nilai fittestIndex ke i.
        if (
          this.individuals[i].calcFitness() >
          this.individuals[fittestIndex].calcFitness()
        ) {
          fittestIndex = i;
        }
      }

      return fittestIndex;
    };

    // Mengembalikan fittest individual
    this.getFittest = function () {
      return this.individuals[this.getFittestIndex()];
    };
  },

  // Membuat individual class
  individual: function (chromosomeLength) {
    this.chromosomeLength = chromosomeLength;
    this.fitness = null;
    this.chromosome = [];

    // Inisialisasi random individual
    this.initialize = function () {
      this.chromosome = [];

      // Looping sebanyak panjang kromosom, inputkan nilai 0 - panjang kromosom secara berurutan ke dalam kromosom
      for (var i = 0; i < this.chromosomeLength; i++) {
        this.chromosome.push(i);
      }

      // Generate random kromosom
      // Membuat angka random lalu dikalikan dengan panjang kromosom dan digunakan sebagai randomIndex
      for (var i = 0; i < this.chromosomeLength; i++) {
        // Buat randomIndex dengan cara mengkalikan angka random dengan panjang kromosom kemudian dibulatkan
        var randomIndex = Math.floor(Math.random() * this.chromosomeLength);
        // Simpan hasil kromosom randomIndex ke tempNode dan swap ke kromosom
        var tempNode = this.chromosome[randomIndex];
        this.chromosome[randomIndex] = this.chromosome[i];
        this.chromosome[i] = tempNode;
      }
    };

    // Set individu kromosom
    this.setChromosome = function (chromosome) {
      this.chromosome = chromosome;
    };

    // Mutasi individu
    this.mutate = function () {
      this.fitness = null;

      // Looping dalam kromosom untuk membentuk perubahan secara random
      for (index in this.chromosome) {
        if (konfigurasiGA.mutationRate > Math.random()) {
          var randomIndex = Math.floor(Math.random() * this.chromosomeLength);
          var tempNode = this.chromosome[randomIndex];
          this.chromosome[randomIndex] = this.chromosome[index];
          this.chromosome[index] = tempNode;
        }
      }
    };

    // Mengembalikan jarak rute individu
    this.getDistance = function () {
      var totalDistance = 0;

      // Looping sebanyak jumlah kromosom
      for (index in this.chromosome) {
        var nodeAwal = this.chromosome[index];
        var nodeAkhir = this.chromosome[0];

        // Jika index + 1 < jumlah kromosom, maka nodeAkhir = kromosom saat ini + 1
        if (parseInt(index) + 1 < this.chromosome.length) {
          nodeAkhir = this.chromosome[parseInt(index) + 1];
        }

        totalDistance += jarak[nodeAwal][nodeAkhir];
      }

      // Jika semua kromosom sudah dilooping maka kembalikan nilai totalDistance
      totalDistance += jarak[nodeAwal][nodeAkhir];

      return totalDistance;
    };

    // Jika nilai fitness tidak sama dengan null maka kembalikan nilai fitness
    // Menghitung nilai fitness individu
    this.calcFitness = function () {
      if (this.fitness != null) {
        return this.fitness;
      }

      var totalDistance = this.getDistance();

      // Mencari nilai fitness, F(x) = 1 / f(x)
      // f(x) = totalDistance yang diperoleh
      this.fitness = 1 / totalDistance;
      return this.fitness;
    };

    // Menerapkan crossover pada individu dan pasangannya saat ini lalu menambahkan offspring pada populasi tertentu
    this.crossover = function (individual, offspringPopulation) {
      var offspringChromosome = [];

      // Menambahkan jumlah bilangan acak dari informasi genetik individu saat ini ke offspring
      var awalPos = Math.floor(this.chromosome.length * Math.random());
      var akhirPos = Math.floor(this.chromosome.length * Math.random());

      var i = awalPos;
      while (i != akhirPos) {
        offspringChromosome[i] = individual.chromosome[i];
        i++;

        if (i > this.chromosome.length) {
          i = 0;
        }
      }

      // Menambahkan informasi genetik yang tersisa dari pasangan individu
      for (parentIndex in individual.chromosome) {
        var node = individual.chromosome[parentIndex];

        var nodeFound = false;
        for (offspringIndex in offspringChromosome) {
          if (offspringChromosome[offspringIndex] == node) {
            nodeFound = true;
            break;
          }
        }

        if (nodeFound == false) {
          for (
            var offspringIndex = 0;
            offspringIndex < individual.chromosome.length;
            offspringIndex++
          ) {
            if (offspringChromosome[offspringIndex] == undefined) {
              offspringChromosome[offspringIndex] = node;
              break;
            }
          }
        }
      }

      // Menambahkan kromosom ke offspring dan menambahkan offspring ke populasi
      var offspring = new konfigurasiGA.individual(this.chromosomeLength);
      offspring.setChromosome(offspringChromosome);
      offspringPopulation.addIndividual(offspring);
    };
  },
};
