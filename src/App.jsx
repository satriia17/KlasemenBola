import React, { useState } from "react";
import { Button, TextInput, Label, Radio, Table } from "flowbite-react";

function App() {
  const [clubs, setClubs] = useState([]); //State Untuk Daftar Klub
  const [clubInput, setClubInput] = useState({ name: "", kota: "" }); //State Untuk Input klub
  const [matches, setMatches] = useState([]); //State Untuk Daftar Pertandingan
  const [matchInput, setMatchInput] = useState([
    { team1: "", team2: "", score1: "", score2: "" },
  ]); //State Untuk Input Pertandingan
  const [selectedOption, setSelectedOption] = useState("single"); //State Untuk Pilihan Tipe input pertandingan
  const [viewKlasemen, setViewKlasemen] = useState(false); // State untuk menampilkan klasemen

  const handleClubInputChange = (event) => {
    //Fungsi Untuk Input Data Klub
    const { name, value } = event.target;
    setClubInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClub = () => {
    //Fungsi Untuk menyimpan Input Klub
    if (clubInput.name && clubInput.kota) {
      const newClub = {
        name: clubInput.name.toUpperCase(),
        kota: clubInput.kota,
      };
      setClubs((prevClubs) => [...prevClubs, newClub]);
      setClubInput({ name: "", kota: "" });
    } else {
      alert("Nama klub dan kota klub harus diisi.");
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...matchInput];
    list[index][name] = value;
    setMatchInput(list);
  };

  const handleAddMatch = () => {
    //Fungsi Untuk Tambah Input pertandingan
    setMatchInput([
      ...matchInput,
      { team1: "", team2: "", score1: "", score2: "" },
    ]);
  };

  const handleSaveMatch = () => {
    //Fungsi Untuk menyimpan Input Pertandingan
    const newMatches = matchInput.filter(
      (match) => match.team1 && match.team2 && match.score1 && match.score2
    );
    const formattedMatches = newMatches.map((match) => ({
      team1: match.team1.toUpperCase(),
      team2: match.team2.toUpperCase(),
      score1: match.score1,
      score2: match.score2,
    }));
    setMatches([...matches, ...formattedMatches]);
    setMatchInput([{ team1: "", team2: "", score1: "", score2: "" }]);
  };

  const calculatePoints = (matches, clubs) => {
    if (matches.length === 0) {
      return clubs.map((club) => ({
        ...club,
        wins: 0,
        draw: 0,
        lose: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
      }));
    }
    //Fungsi untuk perhitungan point
    const updatedClubs = clubs.map((club) => {
      let points = 0,
        wins = 0,
        draw = 0,
        lose = 0,
        goalsFor = 0,
        goalsAgainst = 0;

      matches.forEach((match) => {
        if (match.team1.toUpperCase() === club.name.toUpperCase()) {
          goalsFor += parseInt(match.score1);
          goalsAgainst += parseInt(match.score2);
          if (parseInt(match.score1) > parseInt(match.score2)) {
            points += 3;
            wins++;
          } else if (parseInt(match.score1) === parseInt(match.score2)) {
            points += 1;
            draw++;
          } else {
            lose++;
          }
        } else if (match.team2.toUpperCase() === club.name.toUpperCase()) {
          goalsFor += parseInt(match.score2);
          goalsAgainst += parseInt(match.score1);
          if (parseInt(match.score2) > parseInt(match.score1)) {
            points += 3;
            wins++;
          } else if (parseInt(match.score2) === parseInt(match.score1)) {
            points += 1;
            draw++;
          } else {
            lose++;
          }
        }
      });

      return {
        ...club,
        points,
        wins,
        draw,
        lose,
        goalsFor,
        goalsAgainst,
      };
    });

    return updatedClubs;
  };

  const handleViewKlasemen = () => {
    //Fungsi untuk menampilkan hasil klasemen
    const updatedClubs = calculatePoints(matches, clubs);
    updatedClubs.sort((a, b) => b.points - a.points); //Menyusun klasemen berdasarkan point
    setClubs(updatedClubs); //update state dari club dengan point yang sudah di hitung
    setViewKlasemen(true);
    // console.log(updatedClubs);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center mt-5">
      <div className="text-3xl mb-4">
        <h1>Mini Application Klasemen Sepak Bola</h1>
      </div>
      <div className="text-2xl mb-4">
        <h2>Input Data Klub</h2>
      </div>
      <div className="flex flex-row gap-4">
        <TextInput
          type="text"
          name="name"
          placeholder="Nama Klub"
          value={clubInput.name}
          onChange={handleClubInputChange}
        />
        <TextInput
          type="text"
          name="kota"
          placeholder="Kota Klub"
          value={clubInput.kota}
          onChange={handleClubInputChange}
        />
      </div>
      <Button color="dark" className="my-4" onClick={handleSaveClub}>
        Save
      </Button>
      <div className="text-2xl mb-4">
        <h2>Input Skor Pertandingan</h2>
      </div>
      <div className="flex max-w-md flex-row gap-2 mb-4">
        <div className="flex items-center">
          <Radio
            className="mx-2"
            value="single"
            checked={selectedOption === "single"}
            onChange={() => setSelectedOption("single")}
          />
          <Label className="text-white">Single</Label>
        </div>
        <div className="flex items-center">
          <Radio
            className="mx-2"
            value="multiple"
            checked={selectedOption === "multiple"}
            onChange={() => setSelectedOption("multiple")}
          />
          <Label className="text-white">Multiple</Label>
        </div>
      </div>
      {selectedOption === "single" ? (
        <div className="flex flex-col justify-center items-center">
          {matchInput.map((match, index) => (
            <div className="flex flex-row mb-4">
              <div key={index} className="flex flex-col gap-2">
                <TextInput
                  type="text"
                  name="team1"
                  placeholder="Team 1"
                  value={match.team1}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <TextInput
                  type="text"
                  name="score1"
                  placeholder="Score 1"
                  value={match.score1}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>
              <div className="flex items-center justify-center mx-4">
                <span className="text-3xl">vs</span>
              </div>
              <div className="flex flex-col gap-2">
                <TextInput
                  type="text"
                  name="team2"
                  placeholder="Team 2"
                  value={match.team2}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <TextInput
                  type="text"
                  name="score2"
                  placeholder="Score 2"
                  value={match.score2}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center mb-4">
            <Button color="dark" onClick={handleSaveMatch}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          {matchInput.map((match, index) => (
            <div className="flex flex-row mb-4">
              <div key={index} className="flex flex-col gap-2">
                <TextInput
                  type="text"
                  name="team1"
                  placeholder="Team 1"
                  value={match.team1}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <TextInput
                  type="text"
                  name="score1"
                  placeholder="Score 1"
                  value={match.score1}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>
              <div className="flex items-center justify-center mx-4">
                <span>vs</span>
              </div>
              <div className="flex flex-col gap-2">
                <TextInput
                  type="text"
                  name="team2"
                  placeholder="Team 2"
                  value={match.team2}
                  onChange={(e) => handleInputChange(index, e)}
                />
                <TextInput
                  type="text"
                  name="score2"
                  placeholder="Score 2"
                  value={match.score2}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center mb-4 gap-4">
            <Button color="dark" onClick={handleAddMatch}>
              Add
            </Button>
            <Button color="dark" onClick={handleSaveMatch}>
              Save
            </Button>
          </div>
        </div>
      )}

      <div>
        <Button color="dark" onClick={handleViewKlasemen}>
          View Klasemen
        </Button>
      </div>
      <div className="table-auto mx-auto p-3">
        {viewKlasemen && ( // Tampilkan klasemen hanya jika viewKlasemen bernilai true
          <div>
            <Table className="shadow-md">
              <Table.Head>
                <Table.HeadCell>No</Table.HeadCell>
                <Table.HeadCell>Klub</Table.HeadCell>
                <Table.HeadCell>Ma</Table.HeadCell>
                <Table.HeadCell>Me</Table.HeadCell>
                <Table.HeadCell>S</Table.HeadCell>
                <Table.HeadCell>K</Table.HeadCell>
                <Table.HeadCell>GM</Table.HeadCell>
                <Table.HeadCell>GK</Table.HeadCell>
                <Table.HeadCell>Point</Table.HeadCell>
              </Table.Head>
              {clubs.map((club, index) => (
                <Table.Body className="divide-y">
                  <Table.Row
                    className="bg-gray-800 border-gray-700 text-white"
                    key={index}
                  >
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{club.name}</Table.Cell>
                    <Table.Cell>
                      {(club.wins + club.draw + club.lose).toString()}
                    </Table.Cell>
                    <Table.Cell>{club.wins}</Table.Cell>
                    <Table.Cell>{club.draw}</Table.Cell>
                    <Table.Cell>{club.lose}</Table.Cell>
                    <Table.Cell>{club.goalsFor}</Table.Cell>
                    <Table.Cell>{club.goalsAgainst}</Table.Cell>
                    <Table.Cell>{club.points}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
