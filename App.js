import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  ImageBackground
} from 'react-native';

import Firebase from './js/Firebase';
import Quote from './js/components/Quote';
import NewQuote from './js/components/NewQuote';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';

function StyledButton(props) {
  let button = null;
  if (props.visible)
    button = (
      <View style={props.style}>
        <Button title={props.title} onPress={props.onPress} />
      </View>
    );
  return button;
}
const  imgg = 'https://i.pinimg.com/564x/b5/b0/c9/b5b0c975707a1d909c598e32f1515b4a.jpg';

export default class App extends Component {
  state = { index: 0, showNewQuoteScreen: false, quotes: [], isLoading: true };

  // lấy dữ liệu từ Firebase database
  _retrieveData = async () => {
    let quotes = [];
    let query = await Firebase.db.collection('quotes').get();
    query.forEach(quote => {
      quotes.push({
        id: quote.id,
        text: quote.data().text,
        author: quote.data().author
      });
    });
    this.setState({ quotes, isLoading: false });
  };

  // lưu dữ liệu vô Firebase database
  _saveQuoteToDB = async (text, author, quotes) => {
    docRef = await Firebase.db.collection('quotes').add({ text, author });
    quotes[quotes.length - 1].id = docRef.id;
  };

  // xoá dữ liệu trên Firebase database
  _removeQuoteFromDB(id) {
    Firebase.db
      .collection('quotes')
      .doc(id)
      .delete();
  }

  // thêm dữ liệu ở local database
  _addQuote = (text, author) => {
    let { quotes } = this.state;
    if (text && author) {
      quotes.push({ text, author });
      this._saveQuoteToDB(text, author, quotes);
    }
    this.setState({
      index: quotes.length - 1,
      showNewQuoteScreen: false,
      quotes
    });
  };

  _displayNextQuote() {
    let { index, quotes } = this.state;
    let nextIndex = index + 1;
    if (nextIndex === quotes.length) nextIndex = 0; // chạy hết mảng quotes thì quay lại từ đầu
    this.setState({ index: nextIndex });
  }

  _deleteButton() {
    Alert.alert(
      'Delete Quotes',
      'Are you sure to delete this Quote?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => this._deleteQuote()
        }
      ]
    );
  }

  _deleteQuote() {
    let { index, quotes } = this.state;
    this._removeQuoteFromDB(quotes[index].id);
    quotes.splice(index, 1);
    this.setState({ index: 0, quotes });
  }

  componentDidMount() {
    Firebase.init(); // khởi tạo kết nối firebase
    this._retrieveData();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }
    let { index, quotes } = this.state;
    const quote = quotes[index];
    let content = <Text style={{ fontSize: 36 }}>Quote App</Text>;
    if (quote != null) {
      content = <Quote text={quote.text} author={quote.author} />;
    }
    return (
      <View style={styles.container}>
        <StyledButton
          style={styles.deleteButton}
          visible={quotes.length >= 1}
          title="Delete"
          onPress={() => this._deleteButton()}
        />
        <StyledButton
          style={styles.newButton}
          visible={true}
          title="Add"
          onPress={() => this.setState({ showNewQuoteScreen: true })}
        />
        <NewQuote
          visible={this.state.showNewQuoteScreen}
          onSave={this._addQuote}
        />
        {content}
        <StyledButton
          style={styles.nextButton}
          visible={quotes.length >= 2}
          title="Next Quote"
          onPress={() => this._displayNextQuote()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  nextButton: {
    position: 'absolute',
    bottom: 0
  },
  newButton: {
    position: 'absolute',
    right: 0,
    top: 30
  },
  deleteButton: {
    position: 'absolute',
    left: 0,
    top: 30
  }
});
