import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Button, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';  // Update this line to use named export
import FormComponent from './Income Panel Folder/FormComponent';
import AmarNidhi from './Income Panel Folder/AmarNidhi';
import FixedDeposit from './Income Panel Folder/FixedDeposit';
import Total from './Income Panel Folder/Total';
import AmarNidhiReceipt from './Income Panel Folder/AmarNidhiReceipt';
import SankirtanKhata from './Income Panel Folder/SankirtanKhata';
import ShriHariGollakKhata from './Income Panel Folder/ShriHariGollakKhata';
import BikriKhataGannaSir from './Income Panel Folder/BikriKhataGannaSir';
import BikriKabadSankirtan from './Income Panel Folder/BikriKabadSankirtan';
import GawshalaRaseedKhata from './Income Panel Folder/GawshalaRaseedKhata';
import LandAndBuildingKhata from './Income Panel Folder/LandAndBuildingKhata';
import FormRecords from './Income Panel Folder/FormRecords';
import ExpenseRaseed from './Expense Panel Folder/ExpenseRaseed';
import ExpenseRecords from './Expense Panel Folder/ExpenseRecords';
import DeleteRecords from './Income Panel Folder/DeleteRecords'; // Import DeleteRecords component
import AmarNidhiDelete from './Income Panel Folder/AmarNidhiDelete'; // Import DeleteRecords component
import ExpenseDelete from './Expense Panel Folder/ExpenseDelete';   // Import DeleteRecords component
import MachineryMarammatSir from './Expense Panel Folder/MachineryMarammatSir';
import AtulSharmaKhata from './Expense Panel Folder/AtulSharmaKhata';
import BRSinghjiKhata from './Expense Panel Folder/BRSinghjiKhata';
import BuildingMarammatKhata from './Expense Panel Folder/BuildingMarammatKhata';
import DieselKhata from './Expense Panel Folder/DieselKhata';
import GaushalaBhusaAurChara from './Expense Panel Folder/GaushalaBhusaAurChara';
import GaushalaBuildingPed from './Expense Panel Folder/GaushalaBuildingPed';
import GaushalaDawaiAndOthers from './Expense Panel Folder/GaushalaDawaiAndOthers';
import GaushalaLabourMandeya from './Expense Panel Folder/GaushalaLabourMandeya';
import GaushalaKhal from './Expense Panel Folder/GaushalaKhal';
import KhadBeejSir from './Expense Panel Folder/KhadBeejSir';
import LabourSir from './Expense Panel Folder/LabourSir';
import LandAndBuildingBhandara from './Expense Panel Folder/LandAndBuildingBhandara';
import LightGeneratorMarammatKhata from './Expense Panel Folder/LightGeneratorMarammatKhata';
import ParkMaintenanceKhata from './Expense Panel Folder/ParkMaintenanceKhata';
import RameshBhagatjiKhata from './Expense Panel Folder/RameshBhagatjiKhata';
import SankirtanAnya from './Expense Panel Folder/SankirtanAnya';
import SankirtanGass from './Expense Panel Folder/SankirtanGass';
import SankirtanGehuLabour from './Expense Panel Folder/SankirtanGehuLabour';
import SankirtanKhataDoodh from './Expense Panel Folder/SankirtanKhataDoodh';
import SankirtanKhataMandeya from './Expense Panel Folder/SankirtanKhataMandeya';
import SankirtanLabourKhata from './Expense Panel Folder/SankirtanLabourKhata';
import SankirtanRashanKhata from './Expense Panel Folder/SankirtanRashanKhata';
import SankirtanSabji from './Expense Panel Folder/SankirtanSabji';
import SirLabourMandeya from './Expense Panel Folder/SirLabourMandeya';
import VidyalayaOthersKharcha from './Expense Panel Folder/VidyalayaOthersKharcha';
import VidyaPeethMandeya from './Expense Panel Folder/VidyaPeethMandeya';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activePanel, setActivePanel] = useState('raseed');
  const [anchorEl, setAnchorEl] = useState(null);
  const [incomeAnchorEl, setIncomeAnchorEl] = useState(null);
  const [amarNidhiAnchorEl, setAmarNidhiAnchorEl] = useState(null);
  const [raseedAnchorEl, setRaseedAnchorEl] = useState(null);
  const [expenseAnchorEl, setExpenseAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        handleLogout();
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAmarNidhiClick = (event) => {
    setAmarNidhiAnchorEl(event.currentTarget);
  };

  const handleAmarNidhiClose = (panel) => {
    setAmarNidhiAnchorEl(null);
    if (panel) setActivePanel(panel);
  };

  const handleIncomeClick = (event) => {
    setIncomeAnchorEl(event.currentTarget);
  };

  const handleIncomeClose = (panel) => {
    setIncomeAnchorEl(null);
    if (panel) setActivePanel(panel);
  };

  const handleRaseedClick = (event) => {
    setRaseedAnchorEl(event.currentTarget);
  };

  const handleRaseedClose = (panel) => {
    setRaseedAnchorEl(null);
    if (panel) setActivePanel(panel);
  };

  const handleExpenseClick = (event) => {
    setExpenseAnchorEl(event.currentTarget);
  };

  const handleExpenseClose = (panel) => {
    setExpenseAnchorEl(null);
    if (panel) setActivePanel(panel);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const renderContent = () => {
    switch (activePanel) {
      case 'raseed':
        return <FormComponent />;
      case 'amarNidhi':
        return <AmarNidhi />;
      case 'fixedDeposit':
        return <FixedDeposit />;
      case 'total':
        return <Total />;
      case 'amarNidhiReceipt':
        return <AmarNidhiReceipt />;
      case 'formRecords':
        return <FormRecords />;
      case 'sankirtanKhata':
        return <SankirtanKhata />;
      case 'shriHariGollakKhata':
        return <ShriHariGollakKhata />;
      case 'bikriKhataGannaSir':
        return <BikriKhataGannaSir />;
      case 'bikriKabadSankirtan':
        return <BikriKabadSankirtan />;
      case 'gawshalaRaseedKhata':
        return <GawshalaRaseedKhata />;
      case 'landAndBuildingKhata':
        return <LandAndBuildingKhata />;
      case 'expenseRaseed':
        return <ExpenseRaseed />;
      case 'expenseRecords':
        return <ExpenseRecords />;
      case 'deleteRecords': // Add case for DeleteRecords
        return <DeleteRecords />;
      case 'amarNidhiDelete': // Add case for DeleteRecords
        return <AmarNidhiDelete />;
      case 'expenseDelete': // Add case for DeleteRecords
        return <ExpenseDelete />;
      case 'machineryMarammatSir': 
        return <MachineryMarammatSir />;
      case 'atulSharmaKhata': 
        return <AtulSharmaKhata />;
      case 'brSinghJiKhata': 
        return <BRSinghjiKhata />;       
      case 'buildingMarammatKhata': 
        return <BuildingMarammatKhata />;
      case 'dieselKhata': 
        return <DieselKhata />;
      case 'gaushalaBhusaAurChara': // Add case for DeleteRecords
        return <GaushalaBhusaAurChara />;
      case 'gaushalaBuildingPed': // Add case for DeleteRecords
        return <GaushalaBuildingPed />;
      case 'gaushalaDawaiAndOthers': // Add case for DeleteRecords
        return <GaushalaDawaiAndOthers />;
      case 'gaushalaLabourMandeya': // Add case for DeleteRecords
        return <GaushalaLabourMandeya />;
      case 'gaushalaKhal': // Add case for DeleteRecords
        return <GaushalaKhal />;
      case 'khadBeejSir': // Add case for DeleteRecords
        return <KhadBeejSir />;
      case 'labourSir': // Add case for DeleteRecords
        return <LabourSir />;
      case 'landAndBuildingBhandara': // Add case for DeleteRecords
        return <LandAndBuildingBhandara />;
      case 'lightGeneratorMarammatKhata': // Add case for DeleteRecords
        return <LightGeneratorMarammatKhata />;
      case 'parkMaintenanceKhata': // Add case for DeleteRecords
        return <ParkMaintenanceKhata />;
      case 'rameshBhagatjiKhata': // Add case for DeleteRecords
        return <RameshBhagatjiKhata />;
      case 'sankirtanAnya': // Add case for DeleteRecords
        return <SankirtanAnya />;
      case 'sanirtanGass': // Add case for DeleteRecords
        return <SankirtanGass />;
      case 'sankirtanGehuLabour': // Add case for DeleteRecords
        return <SankirtanGehuLabour />;
      case 'sankirtanKhataDoodh': // Add case for DeleteRecords
        return <SankirtanKhataDoodh />;
      case 'sankirtanKhataMandeya': // Add case for DeleteRecords
        return <SankirtanKhataMandeya />;
      case 'sankirtanLabourKhata': // Add case for DeleteRecords
        return <SankirtanLabourKhata />;
      case 'sankirtanRashanKhata': // Add case for DeleteRecords
        return <SankirtanRashanKhata />;
      case 'sankirtanSabji': // Add case for DeleteRecords
        return <SankirtanSabji />;
      case 'sirLabourMandeya': // Add case for DeleteRecords
        return <SirLabourMandeya />;
      case 'vidyalayaOthersKharcha': // Add case for DeleteRecords
        return <VidyalayaOthersKharcha />;
      case 'vidyaPeethMandeya': // Add case for DeleteRecords
        return <VidyaPeethMandeya />;
      default:
        return <div>Welcome to Shree Haridham Bandh Trust Samitee</div>;
    }
  };

  return (
    <div>
      <div className="banner">
        <h1>श्री हरिधाम बाँध ट्रस्ट समिति (रजिo)</h1>
        <p>ग्राम-मौलनपुर, पोस्ट-गवा, जिला सम्भल (उ.प्र.)</p>
        <div className="subheading">
        <p>दिनांक: {getCurrentDate()}</p>
        </div>
      </div>
      <div className="container">
        <div className="navigation-panel">
          <Typography variant="h5" gutterBottom>
            Navigation Panel
          </Typography>
          <ul>
            <li>
              <Button fullWidth variant="outlined" onClick={handleIncomeClick}>
                Income Panel
              </Button>
              <Menu
                anchorEl={incomeAnchorEl}
                keepMounted
                open={Boolean(incomeAnchorEl)}
                onClose={() => setIncomeAnchorEl(null)}
              >
                <MenuItem onClick={handleRaseedClick}>Raseed Details</MenuItem>
                <Menu
                  anchorEl={raseedAnchorEl}
                  keepMounted
                  open={Boolean(raseedAnchorEl)}
                  onClose={() => setRaseedAnchorEl(null)}
                >
                  <MenuItem onClick={() => handleRaseedClose('raseed')}>Raseed Details Only</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('formRecords')}>Raseed Records</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('sankirtanKhata')}>Sankirtan Khata</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('shriHariGollakKhata')}>Shri Hari Gollak Khata</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('bikriKhataGannaSir')}>Bikri Khata Ganna Sir</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('bikriKabadSankirtan')}>Bikri Kabad Sankirtan</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('gawshalaRaseedKhata')}>Gawshala Raseed Khata</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('landAndBuildingKhata')}>Land and Building Khata</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('deleteRecords')}>Delete Raseed Records</MenuItem> {/* Add this line */}
                </Menu>
                <MenuItem onClick={handleAmarNidhiClick}>AmarNidhi</MenuItem>
                <Menu
                  anchorEl={amarNidhiAnchorEl}
                  keepMounted
                  open={Boolean(amarNidhiAnchorEl)}
                  onClose={() => handleAmarNidhiClose(null)}
                >
                  <MenuItem onClick={() => handleAmarNidhiClose('amarNidhi')}>AmarNidhi</MenuItem>
                  <MenuItem onClick={() => handleAmarNidhiClose('fixedDeposit')}>Fixed Deposit</MenuItem>
                  <MenuItem onClick={() => handleAmarNidhiClose('total')}>Total</MenuItem>
                  <MenuItem onClick={() => handleAmarNidhiClose('amarNidhiReceipt')}>AmarNidhi Receipt</MenuItem>
                  <MenuItem onClick={() => handleAmarNidhiClose('amarNidhiDelete')}>Delete AmarNidhi Records</MenuItem>
                </Menu>
              </Menu>
            </li>
            <li>
              <Button fullWidth variant="outlined" onClick={handleExpenseClick}>
                Expense Panel
              </Button>
              <Menu
                anchorEl={expenseAnchorEl}
                keepMounted
                open={Boolean(expenseAnchorEl)}
                onClose={() => setExpenseAnchorEl(null)}
              >
                <MenuItem onClick={() => handleExpenseClose('expenseRaseed')}>Expense Raseed</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('expenseRecords')}>Expense Records</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('expenseDelete')}>Delete Expense Records</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('atulSharmaKhata')}>Atul Sharma Khata</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('brSinghJiKhata')}>B.R Singh Ji Khata</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('buildingMarammatKhata')}>Building Marammat Khata</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('dieselKhata')}>Diesel Khata</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('gaushalaBhusaAurChara')}>Gaushala Bhusa aur Chara</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('gaushalaBuildingPed')}>Gaushala Building Ped</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('gaushalaDawaiAndOthers')}>Gaushala Dawai and Others</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('gaushalaLabourMandeya')}>Gaushala Labour Mandeya</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('gaushalaKhal')}>Gaushala Khal</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('khadBeejSir')}>Khad Beej Sir</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('labourSir')}>Labour Sir</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('landAndBuildingBhandara')}>Land And Building Bhandara</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('lightGeneratorMarammatKhata')}>Light Generator Marammat Khata</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('machineryMarammatSir')}>Machinery Marammat Sir</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('parkMaintenanceKhata')}>Park Maintenance Khata</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('rameshBhagatjiKhata')}>Ramesh Bhagatji Khata</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanAnya')}>Sankirtan Anya</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanGass')}>Sankirtan Gass</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanGehuLabour')}>Sankirtan Gehu Labour</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanKhataMandeya')}>Sankirtan Khata Mandeya</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanLabourKhata')}>Sankirtan Labour Khata</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanRashanKhata')}>Sankirtan Rashan Khata</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanSabji')}>Sankirtan Sabji</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sirLabourMandeya')}>Sir Labour Mandeya</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('vidyalayaOthersKharcha')}>Vidyalaya Others Kharcha</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('vidyaPeethMandeya')}>Vidya Peeth Mandeya</MenuItem>
              </Menu>
            </li>
            <li>
              <Button fullWidth variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
             </li>
          </ul>
        </div>
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
