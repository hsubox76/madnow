import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { utc } from 'moment';
import firebase from 'firebase';
import '../css/Emails.css';

class Emails extends Component {
  constructor() {
    super();
    this.state = {
      editModalOpen: false,
      emailIdToDelete: null
    };
  }
  handleDeleteClick() {
    const user = firebase.auth().currentUser;
    firebase.database()
      .ref('users/' + user.uid + '/emails/' + this.state.emailIdToDelete)
      .remove()
      .then(() => this.setState({ emailIdToDelete: null }))
      .catch(error => this.setState({error}));
  }
  render() {
    const emails = this.props.userData.emails;
    const buttonsDisabled = Boolean(this.state.emailIdToDelete);
    const disabledClass = this.state.emailIdToDelete ? 'disabled' : '';
    const emailRows = emails && _(emails)
      .map((email, id) => {
        const emailRow = (
          <tr className="email-row" key={id}>
            <td className="email-cell updated-cell">{utc(email.updatedAt).format('LL')}</td>
            <td className="email-cell title-cell">{email.title}</td>
            <td className="email-cell delete-cell">
              <button
                className={"button danger-button " + disabledClass}
                onClick={() => !buttonsDisabled && this.setState({ emailIdToDelete: id })}
              >
                delete
              </button>
            </td>
            <td className="email-cell edit-cell">
              {buttonsDisabled
                ? (
                  <button className="button success-button disabled">edit</button>
                )
                : (
                  <Link
                    className="button success-button"
                    to={{ pathname: '/edit', search: '?emailId=' + id }}
                  >
                    edit
                  </Link>
                )
              }
            </td>
          </tr>
        );
        if (id === this.state.emailIdToDelete) {
          const deleteRow = (
            <tr className="delete-confirm-row" key="delete-row">
              <td className="delete-confirm-cell" colSpan="4">
                <div className="delete-confirm-box">
                  Are you sure you want to delete the above email?
                  <div className="delete-confirm-buttons">
                    <button
                      className="button danger-button"
                      onClick={() => this.handleDeleteClick()}
                    >
                      confirm delete
                    </button>
                    <button
                      className="button cancel-button"
                      onClick={() => this.setState({ emailIdToDelete: null })}
                    >
                      cancel
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          );
          const blankRow = <tr className="blank-row"><td></td></tr>;
          return [emailRow, deleteRow, blankRow];
        }
        return emailRow;
      })
      .flatten()
      .value();
    const emailsTable = emails && (
      <table className="emails-table">
        <thead>
          <tr>
            <td>last updated</td>
            <td>description</td>
          </tr>
        </thead>
        <tbody>{emailRows}</tbody>
      </table>
    );
    return (
      <div className="section email-section">
        <div className="section-title">Your Scheduled Emails</div>
        <div className="section-description">
          Messages you write to yourself that will be delivered to the email address above
          shortly before registration and election days in your state.</div>
        {!emails && (
          <div className="no-emails-message">
            You haven't written any emails yet.
          </div>
        )}
        {emailsTable}
        {buttonsDisabled
          ? (
            <button className="button success-button disabled">
              Write a new email to yourself.
            </button>
          )
          : (
            <Link
              className="button success-button write-email-button"
              to={{ pathname: "/edit", search: "?emailId=new" }}
            >
              Write a new email to yourself.
            </Link>
          )
        }
      </div>
    );
  }
}

Emails.propTypes = {
  userData: PropTypes.object
}

export default Emails;
