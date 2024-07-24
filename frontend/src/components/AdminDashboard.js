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
import DeleteRecords from './Income Panel Folder/DeleteRecords';
import AmarNidhiDelete from './Income Panel Folder/AmarNidhiDelete'; 
import ExpenseDelete from './Expense Panel Folder/ExpenseDelete';   
import MachineryMarammatSir from './Expense Panel Folder/MachineryMarammatSir';
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
import RaseedBalanceSheet from './Balance Sheet Folder/RaseedBalanceSheet';
import AmarnidhiBalanceSheet from './Balance Sheet Folder/AmarnidhiBalanceSheet';
import ExpenseBalanceSheet from './Balance Sheet Folder/ExpenseBalanceSheet';
import UdhaarRaseed from './Udhar Panel Folder/UdhaarRaseed';
import UdhaarRecords from './Udhar Panel Folder/UdhaarRecords';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activePanel, setActivePanel] = useState('raseed');
  const [anchorEl, setAnchorEl] = useState(null);
  const [incomeAnchorEl, setIncomeAnchorEl] = useState(null);
  const [amarNidhiAnchorEl, setAmarNidhiAnchorEl] = useState(null);
  const [raseedAnchorEl, setRaseedAnchorEl] = useState(null);
  const [expenseAnchorEl, setExpenseAnchorEl] = useState(null);
  const [balanceAnchorEl, setBalanceAnchorEl] = useState(null);
  const [udhaarAnchorE1 , setUdhaarAnchorE1] = useState(null);
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

  const handleBalanceClick = (event) => {
    setBalanceAnchorEl(event.currentTarget);
  };

  const handleBalanceClose = (panel) => {
    setBalanceAnchorEl(null);
    if (panel) setActivePanel(panel);
  };

  const handleUdhaarClick = (event) => {
    setUdhaarAnchorE1(event.currentTarget);
  };

  const handleUdhaarClose = (panel) => {
    setUdhaarAnchorE1(null);
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
      case 'deleteRecords': 
        return <DeleteRecords />;
      case 'amarNidhiDelete': 
        return <AmarNidhiDelete />;
      case 'expenseDelete': 
        return <ExpenseDelete />;
      case 'machineryMarammatSir': 
        return <MachineryMarammatSir />;     
      case 'buildingMarammatKhata': 
        return <BuildingMarammatKhata />;
      case 'dieselKhata': 
        return <DieselKhata />;
      case 'gaushalaBhusaAurChara': 
        return <GaushalaBhusaAurChara />;
      case 'gaushalaBuildingPed': 
        return <GaushalaBuildingPed />;
      case 'gaushalaDawaiAndOthers': 
        return <GaushalaDawaiAndOthers />;
      case 'gaushalaLabourMandeya': 
        return <GaushalaLabourMandeya />;
      case 'gaushalaKhal': 
        return <GaushalaKhal />;
      case 'khadBeejSir': 
        return <KhadBeejSir />;
      case 'labourSir': 
        return <LabourSir />;
      case 'landAndBuildingBhandara': 
        return <LandAndBuildingBhandara />;
      case 'lightGeneratorMarammatKhata': 
        return <LightGeneratorMarammatKhata />;
      case 'parkMaintenanceKhata': 
        return <ParkMaintenanceKhata />;
      case 'sankirtanAnya': 
        return <SankirtanAnya />;
      case 'sankirtanGass': 
        return <SankirtanGass />;
      case 'sankirtanGehuLabour': 
        return <SankirtanGehuLabour />;
      case 'sankirtanKhataDoodh': 
        return <SankirtanKhataDoodh />;
      case 'sankirtanKhataMandeya': 
        return <SankirtanKhataMandeya />;
      case 'sankirtanLabourKhata': 
        return <SankirtanLabourKhata />;
      case 'sankirtanRashanKhata': 
        return <SankirtanRashanKhata />;
      case 'sankirtanSabji': 
        return <SankirtanSabji />;
      case 'sirLabourMandeya': 
        return <SirLabourMandeya />;
      case 'vidyalayaOthersKharcha': 
        return <VidyalayaOthersKharcha />;
      case 'vidyaPeethMandeya': 
        return <VidyaPeethMandeya />;
      case 'raseedBalanceSheet':
        return <RaseedBalanceSheet/>;
      case 'amarnidhiBalanceSheet':
        return <AmarnidhiBalanceSheet/>;      
      case 'expenseBalanceSheet':
        return <ExpenseBalanceSheet/>;
      case 'udhaarRaseed':
        return <UdhaarRaseed/>;
      case 'udhaarRecords':
        return <UdhaarRecords/>;         
        default:
        return <div>Welcome to Shree Haridham Bandh Trust Samitee</div>;
    }
  };

  return (
    <div>
      <div className="banner">
        <h1>श्री हरिधाम बांध ट्रस्ट समिति (रजिo)</h1>
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
                आय पैनल
              </Button>
              <Menu
                anchorEl={incomeAnchorEl}
                keepMounted
                open={Boolean(incomeAnchorEl)}
                onClose={() => setIncomeAnchorEl(null)}
              >
                <MenuItem onClick={handleRaseedClick}>रसीद विवरण</MenuItem>
                <Menu
                  anchorEl={raseedAnchorEl}
                  keepMounted
                  open={Boolean(raseedAnchorEl)}
                  onClose={() => setRaseedAnchorEl(null)}
                >
                  <MenuItem onClick={() => handleRaseedClose('raseed')}>रसीद पर्ची</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('formRecords')}>रसीद खता</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('sankirtanKhata')}>संकीर्तन खता</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('shriHariGollakKhata')}>श्री हरि गोलक खाता</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('bikriKhataGannaSir')}>बिकरी खाता गन्ना सीर</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('bikriKabadSankirtan')}>बिक्री कबाड़ संकीर्तन</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('gawshalaRaseedKhata')}>गौशाला रसीद खाता</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('landAndBuildingKhata')}>लैंड एंड बिल्डिंग खाता</MenuItem>
                  <MenuItem onClick={() => handleRaseedClose('deleteRecords')}>डिलीट रसीद खता</MenuItem> {/* Add this line */}
                </Menu>
                <MenuItem onClick={handleAmarNidhiClick}>अमरनिधि विवरण</MenuItem>
                <Menu
                  anchorEl={amarNidhiAnchorEl}
                  keepMounted
                  open={Boolean(amarNidhiAnchorEl)}
                  onClose={() => handleAmarNidhiClose(null)}
                >
                  <MenuItem onClick={() => handleAmarNidhiClose('amarNidhi')}>अमरनिधि रसीद</MenuItem>
                  <MenuItem onClick={() => handleAmarNidhiClose('fixedDeposit')}>फिक्स्ड डिपोसिट</MenuItem>
                  <MenuItem onClick={() => handleAmarNidhiClose('total')}>कुल एफ.डी.</MenuItem>
                  <MenuItem onClick={() => handleAmarNidhiClose('amarNidhiReceipt')}>अमरनिधि रसीद खाता</MenuItem>
                  <MenuItem onClick={() => handleAmarNidhiClose('amarNidhiDelete')}>डिलीट अमरनिधि खाता</MenuItem>
                </Menu>
              </Menu>
            </li>
            <li>
              <Button fullWidth variant="outlined" onClick={handleExpenseClick}>
                व्यय पैनल
              </Button>
              <Menu
                anchorEl={expenseAnchorEl}
                keepMounted
                open={Boolean(expenseAnchorEl)}
                onClose={() => setExpenseAnchorEl(null)}
              >
                <MenuItem onClick={() => handleExpenseClose('expenseRaseed')}>व्यय रसीद</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('expenseRecords')}>व्यय खाता</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('buildingMarammatKhata')}>बिल्डिंग मरम्मत खाता</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('dieselKhata')}>डीजल खाता</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('gaushalaBhusaAurChara')}>गौशाला भूसा और चारा</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('gaushalaBuildingPed')}>गौशाला बिल्डिंग पेड़</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('gaushalaDawaiAndOthers')}>गौशाला दवाई एवं अन्य</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('gaushalaLabourMandeya')}>गौशाला लेबर मानदेय</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('gaushalaKhal')}>गौशाला खाल</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('khadBeejSir')}>खाद बीज सीर</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('labourSir')}>लेबर सीर</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('landAndBuildingBhandara')}>लैंड एंड बिल्डिंग भंडारा</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('lightGeneratorMarammatKhata')}>लाइट जनरेटर मरम्मत खाता</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('machineryMarammatSir')}>मशीनरी मरम्मत सीर</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('parkMaintenanceKhata')}>पार्क मेंटेनेंस खाता</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanAnya')}>संकीर्तन अन्य</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanGass')}>संकीर्तन गैस</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanGehuLabour')}>संकीर्तन गेहू लेबर</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanKhataMandeya')}>संकीर्तन खाता मानदेय</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanLabourKhata')}>संकीर्तन लेबर खाता</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanRashanKhata')}>संकीर्तन राशन खाता</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sankirtanSabji')}>संकीर्तन सब्जी</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('sirLabourMandeya')}>सीर लेबर मानदेय</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('vidyalayaOthersKharcha')}>विद्यालय अन्य खर्चा</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('vidyaPeethMandeya')}>विद्या पीठ मानदेय</MenuItem>
                <MenuItem onClick={() => handleExpenseClose('expenseDelete')}>डिलीट व्यय रिकॉर्ड</MenuItem>
              </Menu>
            </li>
            <li>
            <Button fullWidth variant="outlined" onClick={handleBalanceClick}>
                बैलेंस शीट पैनल
              </Button>
              <Menu
                anchorEl={balanceAnchorEl}
                keepMounted
                open={Boolean(balanceAnchorEl)}
                onClose={() => setBalanceAnchorEl(null)}
              >
                <MenuItem onClick={() => handleBalanceClose('raseedBalanceSheet')}>रसीद बैलेंस शीट</MenuItem>
                <MenuItem onClick={() => handleBalanceClose('amarnidhiBalanceSheet')}>अमरनिधि बैलेंस शीट</MenuItem>
                <MenuItem onClick={() => handleBalanceClose('expenseBalanceSheet')}>व्यय बैलेंस शीट</MenuItem>
              </Menu>  
            </li>
            <li>
            <Button fullWidth variant="outlined" onClick={handleUdhaarClick}>
                उधार पैनल
              </Button>
              <Menu
                anchorEl={udhaarAnchorE1}
                keepMounted
                open={Boolean(udhaarAnchorE1)}
                onClose={() => setUdhaarAnchorE1(null)}
              >
                <MenuItem onClick={() => handleUdhaarClose('udhaarRaseed')}>उधार रसीद</MenuItem>
                <MenuItem onClick={() => handleUdhaarClose('udhaarRecords')}>उधार खाता</MenuItem>
              </Menu>  
            </li>
            <li>
              <Button fullWidth variant="outlined" onClick={handleLogout}>
              लॉग आउट
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
