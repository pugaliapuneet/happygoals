import React from 'react';
import {StyleSheet} from 'react-native';

const mainHue = 200;
// const backgroundColor = "hsl("+mainHue+", 10%, 20%)";
const backgroundColor = "#F3F8F8";
const primaryColor = "#3DA848";
const gutter = 16;

const styles = StyleSheet.create({
  container: { backgroundColor: backgroundColor, paddingVertical: gutter/2, },

  body: {backgroundColor: backgroundColor},

  row: {marginBottom: 25},
  horizontal: {flexDirection: 'row'},
  goalTitle: {marginRight: 0},
  // border: { borderWidth: 1 },
  goal: { fontSize: 16, color: 'hsl(0, 40%, 50%)', fontFamily: 'Quicksand-Bold', fontSize: 16,},
  // label: { color: 'hsl('+mainHue+', 40%, 50%)', fontSize: 14, marginBottom: 5},
  stat: { fontFamily: 'Quicksand-Light', fontStyle: 'normal', fontSize:48, fontWeight:'300', color:'#B5B5B5' },
  weeklyProgress: { backgroundColor: '#ddd', width: 20, flex: 1, height: 5, color: 'black', borderWidth: 1, borderColor: 'white', marginTop: 5, },
  monthlyMarker: {borderRadius: 5, width: '3%', height: 5, marginRight: 3, marginTop: 10,},

  dashboardStat: {flexDirection: 'row-reverse', justifyContent: 'space-between',},
  dashboardStatFigure: {fontSize: 15, lineHeight: 22, marginBottom: gutter, marginLeft: gutter, textAlign: 'right', paddingHorizontal: 10, backgroundColor: '#00000090', borderRadius: 15, color: 'hsl(150, 40%, 80%)'},
  dashboardStatLabel: {fontSize: 15, lineHeight: 22, marginBottom: gutter, marginLeft: gutter},

  //backgroundColor: 'white', _marginHorizontal: gutter, _marginVertical: gutter/2,elevation: 5, padding: 15
  //borderBottomColor: 'hsl(0, 40%, 45%)', borderBottomWidth: 1, borderTopColor: 'hsl(0, 40%, 55%)', borderTopWidth: 1,
  card: {backgroundColor: 'hsl(200, 10%, 90%)', margin: 10, borderRadius: 5, marginBottom: 0},
  smallcard: { padding: 5, paddingHorizontal: 10, marginLeft: gutter/2, marginRight: gutter/2},

  cardHeaderMeta: {color: 'rgba(0,0,0,0.5)', fontSize: 12, fontFamily: 'Quicksand-Bold'},

  label: {marginRight: 15},
  // greenLabel: {color: 'hsl(150, 20%, 50%)', backgroundColor: 'hsl(150, 20%, 80%)', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 25, fontSize: 12},
  // borderWidth: 2, borderColor: 'white',
  // paddingVertical: 2, paddingHorizontal: 10,
  // borderRadius: 25,
  // greenLabel: {color: 'white', fontSize: 12},

  headerStyle: {elevation: 0, height: 50, paddingTop: 15, backgroundColor: backgroundColor,},
  headerTitleStyle: {fontWeight: 'normal', fontSize: 18, alignSelf: 'center'},

  tabBarStyle: {backgroundColor: backgroundColor, paddingLeft: 10, elevation: 0},
  tabBarLabelStyle:{fontSize: 12, marginBottom: 0, paddingBottom: 0, height: 30, paddingTop: 5},
  tabBarActiveTintColor: {color: 'hsl('+mainHue+', 40%, 100%)'},
  tabBarInactiveTintColor: {color: 'hsl('+mainHue+', 40%, 80%)'},

  calendarFlatList: {position: 'absolute', left: 15, right: 0, paddingTop: 35},
  checkboxContainerStyle: {padding: 10, marginBottom: 35},
  checkboxStyle: {fontFamily: 'Quicksand-Bold', backgroundColor: 'transparent', width: 20, height: 20, color: 'white', textAlign: 'center', borderRadius: 10, fontSize: 12, opacity: 1},
  checkboxHighlightStyle: {opacity: 1},
  checkboxFillStyle: {opacity: 1, backgroundColor: 'white', marginBottom: 20},

  calendarItemlabel: {fontFamily: 'Quicksand-Medium', fontSize: 12, color: '#fff', paddingVertical: 8, lineHeight: 20, marginBottom: 38, opacity: 0.5},

  //ModeChoiceButton
  modeChoice: {},
  MCB: {paddingTop: 12, borderRadius: 3, borderWidth: 1, borderColor: '#ccc', padding: 12},
  MCBText: {opacity: 0.5, marginBottom: 10},
  MCBHeader: {marginBottom: 10},

  textInput: {borderBottomWidth: 1, borderColor: '#ccc',
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
    padding: 0, margin: 0,
    height: 36, lineHeight: 36,},

  bigTextInput: {fontFamily: 'Quicksand-Bold', marginBottom: 25, fontSize: 18, borderRadius: 5, borderWidth: 1, borderColor: "#E3E3E3", color: primaryColor},
  yellowButton: {backgroundColor: '#FFECB3', borderRadius: 3, overflow: 'hidden', color: '#5D4037', textAlign: 'center', paddingHorizontal: 24, paddingVertical: 6, paddingBottom: 8},

  picker: { padding: 0, margin: 0, height: 36, lineHeight: 36,},

  pickerItem: {fontSize: 12, fontFamily: 'Quicksand-Bold'},

  //position: 'absolute', top: 5, bottom: 5, left: 5, right: 5,
  modal: {backgroundColor: 'white', padding: 0, borderRadius: 5},
  modalLabel: {fontSize: 13, opacity: 0.4},

  rowwrap: {flexDirection: 'row', flexWrap: 'wrap'},

  colorLayer: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'orange', borderRadius: 3, opacity: 0},

  cardShadow: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },

  journalScore: {fontSize: 50, lineHeight: 60, color: primaryColor, fontFamily: 'Nunito-ExtraLight', textAlign: 'center'},
});


//TODO: Card state styles not needed anymore.
const listed = StyleSheet.create({
  container: {},
  card: {backgroundColor: 'rgba(0,0,10,0.75)', backgroundColor: '#37474F', margin: 15, borderRadius: 5, marginTop: 0, overflow: 'hidden'},
  goalIcon: {display: 'none'},
  goalName: {color: 'white', fontFamily: 'Quicksand-Medium', fontSize: 20, marginBottom: 0, marginTop: -5},
  score: {fontSize: 50, lineHeight: 60, color: 'white', fontFamily: 'Nunito-ExtraLight'},
  metadata: {borderBottomLeftRadius: 5, borderBottomRightRadius: 5, color: 'rgba(0,0,0,0.5)', fontSize: 12, fontFamily: 'Quicksand-Bold', backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 25, paddingVertical: 15},
  labels: {margin: 12, color: 'hsla(100, 70%, 60%, 1)', marginRight: 5, fontSize: 12},
  backlogs: {margin: 12, color: 'hsla(0, 70%, 60%, 1)', marginRight: 5, fontSize: 12},
  headerContainer: {padding: 25},
  bodyVisibility: {display: 'none', opacity: 0}
});

const minimized = StyleSheet.create({
  container: {},
  card: {backgroundColor: "hsl(100, 50%, 40%)", backgroundColor: '#689F38', margin: 15, borderRadius: 5, marginTop: 0, overflow: 'hidden'},
  goalIcon: {display: 'none'},
  goalName: { color: "white", fontSize: 20, fontFamily: 'Quicksand-Medium'},
  score: {color: "white", fontSize: 30, padding: 0, marginTop: -7, borderWidth: 0, fontFamily: 'Nunito-Light'},
  metadata: {display: 'none'},
  // labels: {marginLeft: 5, display: 'none'},
  labels: {borderWidth: 0, margin: 12, color: 'white', marginRight: 5, marginTop: 0, fontSize: 12},
  backlogs: {borderWidth: 0, margin: 12, color: 'white', marginRight: 5, marginTop: 0, fontSize: 12},
  headerContainer: {padding: 25},
  bodyVisibility: {display: 'none', opacity: 0}
});

const snoozed = StyleSheet.create({
  container: {},
  card: {backgroundColor: "hsl(100, 0%, 40%)", margin: 15, borderRadius: 5, marginTop: 0, overflow: 'hidden'},
  goalIcon: {display: 'none'},
  goalName: { color: "white", fontSize: 20, fontFamily: 'Quicksand-Medium'},
  score: {color: "white", fontSize: 30, padding: 0, marginTop: -7, borderWidth: 0, fontFamily: 'Nunito-Light'},
  metadata: {display: 'none'},
  labels: {marginLeft: 25, marginTop: 5, marginBottom: 5, display: 'none'},
  backlogs: {marginLeft: 25, marginTop: 5, marginBottom: 5, display: 'none'},
  headerContainer: {padding: 25},
  bodyVisibility: {display: 'none', opacity: 0}
});

const maximizedgreen = StyleSheet.create({
  container: {padding: 25},
  card: {backgroundColor: "hsl(100, 50%, 40%)", backgroundColor: '#689F38', margin: 15, borderRadius: 5, marginTop: 0, overflow: 'hidden'},
  goalIcon: {display: 'none',},
  goalName: { color: 'white', fontFamily: 'Quicksand-Medium', fontSize: 20, marginTop: -5},
  score: {fontFamily: 'Nunito-ExtraLight', fontSize: 50, lineHeight: 60, color: 'white'},
  metadata: {borderBottomLeftRadius: 5, borderBottomRightRadius: 5, color: 'rgba(0,0,0,0.5)', fontSize: 12, fontFamily: 'Quicksand-Bold', backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 25, paddingVertical: 15},
  labels: {margin: 12, marginRight: 5, fontSize: 12, color: 'white'},
  backlogs: {margin: 12, marginRight: 5, fontSize: 12, color: 'white'},
  headerContainer: {padding: 25},
  bodyVisibility: {},
  coloredText: {color: 'hsl(100, 50%, 40%)'},
});

const maximizedblue = StyleSheet.create({
  container: {padding: 25},
  // card: {backgroundColor: "hsl(200, 50%, 40%)", margin: 10, borderRadius: 5, marginBottom: 0},
  card: {backgroundColor: 'rgba(0,0,0,0.5)', backgroundColor: '#37474F', margin: 15, borderRadius: 5, marginTop: 0, overflow: 'hidden'},
  goalIcon: {display: 'none',},
  goalName: { color: 'white', fontFamily: 'Quicksand-Medium', fontSize: 20, marginTop: -5},
  score: {fontFamily: 'Nunito-ExtraLight', fontSize: 50, lineHeight: 60, color: 'white'},
  metadata: {borderBottomLeftRadius: 5, borderBottomRightRadius: 5, color: 'rgba(0,0,0,0.5)', fontSize: 12, fontFamily: 'Quicksand-Bold', backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 25, paddingVertical: 15},
  labels: {margin: 12, color: 'hsla(100, 70%, 60%, 1)', marginRight: 5, fontSize: 12},
  backlogs: {margin: 12, color: 'hsla(0, 70%, 60%, 1)', marginRight: 5, fontSize: 12},
  headerContainer: {padding: 25},
  bodyVisibility: {},
  coloredText: {color: 'hsl(200, 50%, 40%)'},
});

const golden = StyleSheet.create({
  container: {padding: 25},
  // card: {backgroundColor: "hsl(200, 50%, 40%)", margin: 10, borderRadius: 5, marginBottom: 0},
  card: {backgroundColor: '#EF6C00', margin: 15, borderRadius: 5, marginBottom: 0, overflow: 'hidden'},
  goalIcon: {display: 'none',},
  goalName: { color: 'white', fontFamily: 'Quicksand-Medium', fontSize: 20, marginTop: -5},
  score: {fontFamily: 'Nunito-ExtraLight', fontSize: 50, lineHeight: 60, color: 'white'},
  metadata: {borderBottomLeftRadius: 5, borderBottomRightRadius: 5, color: 'rgba(0,0,0,0.5)', fontSize: 12, fontFamily: 'Quicksand-Bold', backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 25, paddingVertical: 15},
  labels: {margin: 12, color: 'hsla(100, 70%, 60%, 1)', marginRight: 5, fontSize: 12},
  backlogs: {margin: 12, color: 'hsla(0, 70%, 60%, 1)', marginRight: 5, fontSize: 12},
  headerContainer: {padding: 25},
  bodyVisibility: {},
  coloredText: {color: 'hsl(200, 50%, 40%)'},
});

export {styles, listed, minimized, maximizedblue, maximizedgreen, snoozed, golden, primaryColor};
